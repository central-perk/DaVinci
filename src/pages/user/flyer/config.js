define([], function() {
	return {
		filter: {
			flyer: [{
				label: '我的作品',
				name: 'all'
			}, {
				label: '草稿',
				name: 'draft',
				query: {
					status: 10
				}
			}, {
				label: '已发布',
				name: 'published',
				query: {
					status: 20
				}
			}, {
				label: '待更新',
				name: 'updated',
				query: {
					status: 30
				}
			}, {
				label: '已冻结',
				name: 'freeze',
				query: {
					freeze: true
				}
			}]
		}
	};
});