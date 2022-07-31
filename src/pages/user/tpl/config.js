define([], function () {
	return {
		filter: {
			created: [{
				label: '我创建的',
				name: 'all',
				query: {
					purchased: false
				}
			}, {
				label: '草稿',
				name: 'draft',
				query: {
					status: 10,
					purchased: false
				}
			}, {
				label: '待审核',
				name: 'verifying',
				query: {
					status: '20',
					purchased: false
				}
			}, {
				label: '已上架',
				name: 'onsale',
				query: {
					status: 30,
					purchased: false
				}
			}, {
				label: '审核失败',
				name: 'verifyFailed',
				query: {
					status: 50,
					purchased: false
				}
			}, {
				label: '已下架',
				name: 'offshelves',
				query: {
					status: 40,
					purchased: false
				}
			}]
		}
	};
});