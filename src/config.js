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
            name: "??????",
            href: "/f/:flyerID/summary",
            operate: "summary",
          },
          {
            name: "??????",
            href: "/f/:flyerID/edit",
            operate: "edit",
          },
          {
            name: "??????",
            href: "/f/:flyerID/setting",
            operate: "setting",
          },
          {
            name: "??????",
            href: "/f/:flyerID/spread",
            operate: "spread",
          },
          {
            name: "??????",
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
            name: "??????",
            href: "/f/:flyerID/data/flyer",
            operate: "flyer",
          },
          {
            name: "??????",
            href: "/f/:flyerID/data/checkin",
            operate: "checkin",
          },
          // , {
          //     name: '??????',
          //     href: '/f/:flyerID/data/channel',
          //     operate: 'channel'
          // }
          // , {
          //     name: '??????',
          //     href: '/f/:flyerID/data/vote',
          //     operate: 'vote'
          // }, {
          //     name: '??????',
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
            name: "??????",
            operate: "flyer",
          },
          {
            name: "??????",
            operate: "checkin",
          },
          {
            name: "?????????",
            operate: "qr",
          },
          // , {
          //     name: '??????',
          //     operate: 'vote'
          // }, {
          //     name: '??????',
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
            name: "????????????",
            operate: "sns",
          },
          {
            name: "????????????",
            operate: "addr",
          },
          {
            name: "?????????",
            operate: "qr",
          },
          // {
          //     name: '??????',
          //     operate: 'sms'
          // }, {
          //     name: '??????',
          //     operate: 'email'
          // },
          {
            name: "??????",
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
          md: "??????????????????360x360",
          sm: "??????????????????120x120",
        },
        rect: {
          md: "??????????????????360x240",
          lg: "??????????????????630x420",
        },
        bg: "????????????????????????960x640",
      },
      interact: {
        bg: "????????????????????????640x1012",
        button: "??????????????????480x80",
        square: {
          sm: "??????????????????120x120",
          md: "??????????????????320x320",
          lg: "??????????????????640x640",
        },
        rect: {
          md: "??????????????????320x480",
        },
      },
      common: {
        square: {
          md: "??????????????????180x180",
        },
        logo: "??????????????????260x260",
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
