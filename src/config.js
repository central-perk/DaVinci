define(["app"], function (app) {
  var config = {
    APP: {
      title: "Davinci",
    },
    ANIMATES: {
      bounceIn: "form-bounceIn bounceIn-animated",
      wobble: "wobble animated",
    },
    EVENTS: {
      cptViewChange: "cptViewChange",
      cptPicConfigChange: "cptPicConfigChange",
      cptValidateChange: "cptValidateChange",
      cptContentChange: "cptContentChange",
      cptInert: "cpt-insert",
      cptCreate: "cpt-create",
      cptClick: "cptClick",
      cptToolbarChange: "cptToolbarChange",
      cptInit: "cptInit",
      getUserAmount: "getUserAmount",
      flyerCardClick: "flyerCardClick",
      getAccount: "getAccount",
      getProfile: "getProfile",
      cptsInit: "cptsInit",
      countUnReadMessages: "countUnReadMessages",
      alert: "alert",
      getCurNavName: "getCurNavName",
      getScopeProfile: "getScopeProfile",
      getFlyer: "ggetFlyer",
      getFlyerInfo: "getFlyerInfo",
      refreshBoardNavs: "refreshBoardNavs",
      cptHeaderTextTitleChange: "cptHeaderTextTitleChange",
      flyerRouteChange: "flyerRouteChange",
      flyerBoardTitleChange: "flyerBoardTitleChange",
      flyerChange: "flyerChange",
      flyerDesignChange: "flyerDesignChange",
      userProfileChange: "userProfileChange",
      setBoardFlyerTitle: "setBoardFlyerTitle",
      getUser: "getUser",
      savePicker: "savePicker",
      popoverBoxClick: "popoverBoxClick",
      editorChange: "editorChange",
      pageEditorClick: "pageEditorClick",
      pageValidateChange: "pageValidateChange",
      pageClick: "pageClick",
      pgThumbClick: "pgThumbClick",
      pgAddClick: "pgAddClick",
      designTbClick: "designTbClick",
      designBtnsClick: "designBtnsClick",
      pickerTbClick: "pickerTbClick",
      pickerTbHover: "pickerTbHover",
      designCustomClick: "designCustomClick",
      customValidPass: "customValidPass",
      bgCustomClick: "bgCustomClick",
      audioCustomClick: "audioCustomClick",
      pageChange: "pageChange",
      pageEditorHover: "pgEditorHover",
      editorCustomClick: "editorCustomClick",
      contactsTbClick: "contactsTbClick",
      groupManageClick: "groupManageClick",
      groupEditClick: "groupEditClick",
      connect: "connect",
      checkinsTbClick: "checkinsTbClick",
      checkinNotificationFormClick: "checkinNotificationFormClick",
      flyerTagHotClick: "flyerTagHotClick",
      flyerBoardClick: "flyerBoardClick",
      sliderEditorClick: "sliderEditorClick",
      sliderNodeEditorClick: "sliderNodeEditorClick",
      sliderNodePicClick: "sliderNodePicClick",
      flexCarouselClick: "flexCarouselClick",
      pgImageClick: "pgImageClick",
      imageManageClick: "imageManageClick",
      imageUpload: "imageUpload",
      imageCropClick: "imageCropClick",
      globalMaskClick: "globalMaskClick",
      flyerBoardInit: "flyerBoardInit",
      effectChange: "effectChange",
      interactFlyerEditorTopBarClick: "interactFlyerEditorTopBarClick",
      pageBgClick: "pageBgClick",
      layerClick: "layerClick",
      pgAddBtnClick: "pgAddBtnClick",
      topBarClick: "topBarClick",
      pgVesselClick: "pgVesselClick",
      tplPreviewClick: "tplPreviewClick",
    },
    FLYERS_PAGE: {
      board: {
        navs: [
          {
            name: "概况",
            href: "/f/:flyerID/summary",
            operate: "summary",
          },
          {
            name: "制作",
            href: "/f/:flyerID/edit",
            operate: "edit",
          },
          {
            name: "配置",
            href: "/f/:flyerID/setting",
            operate: "setting",
          },
          {
            name: "传播",
            href: "/f/:flyerID/spread",
            operate: "spread",
          },
          {
            name: "数据",
            href: "/f/:flyerID/data/flyer",
            operate: "data",
          },
        ],
        operates: {
          summary: "summary",
          edit: "edit",
          setting: "setting",
          spread: "spread",
          data: "data",
        },
      },
      data: {
        navs: [
          {
            name: "传单",
            href: "/f/:flyerID/data/flyer",
            operate: "flyer",
          },
          {
            name: "表单",
            href: "/f/:flyerID/data/checkin",
            operate: "checkin",
          },
          // , {
          //     name: '渠道',
          //     href: '/f/:flyerID/data/channel',
          //     operate: 'channel'
          // }
          // , {
          //     name: '投票',
          //     href: '/f/:flyerID/data/vote',
          //     operate: 'vote'
          // }, {
          //     name: '商品',
          //     href: '/f/:flyerID/data/good',
          //     operate: 'good'
          // }
        ],
        operates: {
          checkin: "checkin",
          vote: "vote",
          channel: "channel",
        },
      },
      setting: {
        navs: [
          {
            name: "传单",
            operate: "flyer",
          },
          {
            name: "登记",
            operate: "checkin",
          },
          {
            name: "二维码",
            operate: "qr",
          },
          // , {
          //     name: '投票',
          //     operate: 'vote'
          // }, {
          //     name: '商品',
          //     operate: 'goods'
          // }
        ],
        operates: {
          flyer: "flyer",
          checkin: "checkin",
          qr: "qr",
          vote: "vote",
          goods: "goods",
        },
      },
      spread: {
        navs: [
          {
            name: "社交分享",
            operate: "sns",
          },
          {
            name: "在线地址",
            operate: "addr",
          },
          {
            name: "二维码",
            operate: "qr",
          },
          // {
          //     name: '短信',
          //     operate: 'sms'
          // }, {
          //     name: '邮件',
          //     operate: 'email'
          // },
          {
            name: "导出",
            operate: "export",
          },
        ],
        operates: {
          sns: "sns",
          addr: "addr",
          qr: "qr",
          sms: "sms",
          email: "email",
          export: "export",
        },
      },
    },
    CLASSES: {
      plan: {
        10: "free",
        20: "std",
        30: "exp",
        40: "ent",
      },
    },
    PAGES: {
      editState: {
        initial: 0,
        change: 1,
        error: 2,
      },
      env: {
        et: "et",
        dt: "et",
      },
    },
    PICSIZE: {
      static: {
        square: {
          md: "图片建议尺寸360x360",
          sm: "图片建议尺寸120x120",
        },
        rect: {
          md: "图片建议尺寸360x240",
          lg: "图片建议尺寸630x420",
        },
        bg: "背景图片建议尺寸960x640",
      },
      interact: {
        bg: "背景图片建议尺寸640x1012",
        button: "图片建议尺寸480x80",
        square: {
          sm: "图片建议尺寸120x120",
          md: "图片建议尺寸320x320",
          lg: "图片建议尺寸640x640",
        },
        rect: {
          md: "图片建议尺寸320x480",
        },
      },
      common: {
        square: {
          md: "图片建议尺寸180x180",
        },
        logo: "图片建议尺寸260x260",
      },
    },
    SCREEN_SIZE: {
      editor: {
        interact: {
          width: 320,
          height: 506,
        },
      },
    },
    FI_EDITOR: {
      LAYER: {
        link: {
          types: [
            {
              type: "none",
              name: "none",
            },
            {
              type: "web",
              name: "webpage",
            },
            {
              type: "tel",
              name: "phone",
            },
            {
              type: "page",
              name: "page",
            },
          ],
          placeholder: {
            web: "Please enter the web address",
            tel: "Please enter a phone number",
          },
        },
      },
    },
  };
  if (window.DVC && window.DVC.config) {
    angular.extend(config, window.DVC.config);
  }
  app.constant("config", config);
  return config;
});
