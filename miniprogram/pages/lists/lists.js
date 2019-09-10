// pages/note_books/note_books.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0,
    nothing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.getList(true)
    } else {
      app.checkLoginReadyCallback = res => {
        this.getList(true)
      };
    }
  },
  getList: function (type = false) {
    let that = this;
    wx.cloud.callFunction({
      name: 'getLists',
      data: {
        author: app.globalData.userInfo._id,
        page: that.data.page
      },
      success: function (res) {
        if (res.result.length > 0) {
          if (type) {
            that.setData({
              list: res.result,
              page: that.data.page + 1
            }, () => {
              wx.hideLoading();
              wx.stopPullDownRefresh();
            })
          } else {
            that.setData({
              list: that.data.list.concat(res.result),
              page: that.data.page + 1
            }, () => {
              wx.hideLoading();
              wx.stopPullDownRefresh();
            })
          }

        } else {
          that.setData({
            nothing: true,
          })
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  onReachBottom: function () {
    if (!this.data.nothing) {
      this.getList()
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      nothing: false
    });
    this.getList(true);
  },

  nav_add_node_book: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) {
            wx.navigateTo({
              url: '/pages/lists_add/lists_add',
            });
          } else {
            app.checkLoginReadyCallback = res => {
              wx.navigateTo({
                url: '/pages/lists_add/lists_add',
              });
            };
          }
        } else {
          wx.showModal({
            title: `授权`,
            confirmText: '去授权',
            cancelText: '再看看',
            content: '授权解锁更多功能',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/author/author',
                });
              } else if (res.cancel) {
                return;
              }
            }
          })
        }
      }
    });

  },
})