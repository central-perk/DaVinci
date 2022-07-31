define(['app'], function(app) {
    app.service('$image', ['$q', '$http', '$user', '$alert', '$upload', '$utils', 'config',
        function($q, $http, $user, $alert, $upload, $utils, config) {
            var imageSizeLimit = config.USERS.limit.imageSize;
            var allowFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
                regFileSuffix = new RegExp(/\.(jpg|jpeg|png|gif)$/i),
                snippets = {
                    upload: '请上传图片',
                    fileTypeValidate: '图片格式不正确', //目前仅支持上传png,jpeg,jpg,gif
                    fileMaxSizeValidate: '大于' + imageSizeLimit / 1024 + 'KB不能上传',
                    fileMinSizeValidate: '图片过小不能上传',
                    maxFileCount: '最多同时上传5张图片'
                },
                maxFileCount = 5,
                fileStatus = {
                    error: 10,
                    progress: 20,
                    success: 30
                };

            var ImageService = {
                isSuccess: function(status) {
                    return status === fileStatus.success;
                },
                isError: function(status) {
                    return status === fileStatus.error;
                },
                list: function(options) {
                    var delay = $q.defer();
                    var queryStr = $utils.makeQuery(options);
                    $http({
                            method: 'get',
                            url: '/api/images?' + queryStr
                        })
                        .
                    success(function(data, status, headers, config) {
                        if (data.code === 200) {
                            delay.resolve(data.msg);
                        } else {
                            $alert.error(data.msg);
                        }
                    });
                    return delay.promise;
                },
                mulitiUpload: function(options) {
                    var self = this,
                        delay = $q.defer(),
                        selectImages = options.images,
                        tags = options.tags,
                        images = [],
                        uploadImages = [];

                    if (selectImages.length > maxFileCount) {
                        $alert.error(snippets.maxFileCount);
                        return delay.promise;
                    }

                    for (var i = 0; i < selectImages.length; i++) {
                        if (!$utils.validateFileType(allowFileTypes, selectImages[i].type)) {
                            images.push({
                                name: selectImages[i].name,
                                status: fileStatus.error,
                                snippet: snippets.fileTypeValidate
                            });
                            continue;
                        }
                        if (!$utils.validateFileExt(allowFileTypes, selectImages[i].name.toLowerCase())) {
                            images.push({
                                name: selectImages[i].name,
                                status: fileStatus.error,
                                snippet: snippets.fileTypeValidate
                            });
                            continue;
                        }
                        if (!regFileSuffix.test(selectImages[i].name.toLowerCase())) {
                            images.push({
                                name: selectImages[i].name,
                                status: fileStatus.error,
                                snippet: snippets.fileTypeValidate
                            });
                            continue;
                        }

                        // 大小限制 2M
                        if (selectImages[i].size > imageSizeLimit) {
                            images.push({
                                name: selectImages[i].name,
                                status: fileStatus.error,
                                snippet: snippets.fileMaxSizeValidate
                            });
                            continue;
                        }

                        if (selectImages[i].size === 0) {
                            images.push({
                                name: selectImages[i].name,
                                status: fileStatus.error,
                                snippet: snippets.fileMinSizeValidate
                            });
                            continue;
                        }

                        images.push({
                            name: selectImages[i].name,
                            status: fileStatus.progress
                        });

                        uploadImages.push(selectImages[i])
                    }
                    delay.resolve({
                        images: images
                    });
                    if (uploadImages && uploadImages.length > 0) {
                        self.apiMulitiUpload({
                            images: images,
                            uploadImages: uploadImages,
                            tags: tags,
                            onSuccessCallback: options.onSuccessCallback
                        });
                    }
                    return delay.promise;
                },
                apiMulitiUpload: function(options) {
                    var images = options.images,
                        uploadImages = options.uploadImages,
                        tags = options.tags,
                        onSuccessCallback = options.onSuccessCallback;
                    if (!uploadImages) {
                        return $alert.error(snippets.upload);
                    }
                    for (var i = 0; i < uploadImages.length; i++) {
                        $upload.upload({
                                url: '/api/images/upload', //upload.php script, node.js route, or servlet url
                                file: uploadImages[i], // or list of files ($files) for html5 only
                                data: {
                                    tags: tags,
                                    size: uploadImages[i].size
                                }
                            })
                            .progress(function(evt) {

                            })
                            .success(function(data, status, headers, config) {
                                if (data.code === 200) {
                                    if (onSuccessCallback) {
                                        onSuccessCallback({
                                            image: data.msg
                                        });
                                    }
                                } else {
                                    $alert.error(data.msg);
                                }
                            })
                            .error(function() {});
                    }

                },
                crop: function(options) {
                    var form = options.data,
                        storageLocal = options.storageLocal,
                        delay = $q.defer();

                    $http({
                            method: 'post',
                            url: '/api/images/crop',
                            data: form,
                            timeout: 5000
                        })
                        .
                    success(function(data, status, headers, config) {
                        if (data.code === 200) {
                            var msg = {
                                action: 'save',
                                cropUrl: data.msg.cloudUrl,
                                url: form.url,
                                crop: form.crop,
                                image: data.msg.image
                            };
                            if (storageLocal) {
                                msg.localCropUrl = data.msg.localUrl;
                            }
                            delay.resolve(msg);
                        } else {
                            delay.reject(data.msg);
                            $alert.error(data.msg);
                        }
                    });
                    return delay.promise;
                },
                create: function(options) {
                    var url = options.url,
                        tags = options.tags,
                        delay = $q.defer();
                    $http({
                            method: 'post',
                            url: '/api/images',
                            data: {
                                url: url,
                                tags: tags
                            }
                        })
                        .
                    success(function(data, status, headers, config) {
                        if (data.code === 200) {
                            delay.resolve(data.msg);
                        } else {
                            delay.reject(data.msg);
                            $alert.error(data.msg);
                        }
                    });
                    return delay.promise;
                },
                delAll: function(images, callback) {
                    var imageIds = _.pluck(images, '_id')
                        .join(',');
                    if (images && images.length >= 1) {
                        $http({
                                method: 'delete',
                                url: '/api/images?_ids=' + imageIds
                            })
                            .
                        success(function(data, status, headers, config) {
                            if (data.code === 200) {
                                callback();
                            } else {
                                $alert.error(data.msg);
                            }
                        });
                    } else {
                        console.log('image length < 1');
                    }
                }
            };
            return ImageService;
        }
    ]);
});
