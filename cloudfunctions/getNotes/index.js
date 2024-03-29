// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.env,
  traceUser: true,
})
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let list = (await db.collection('note').where({ author: event.author }).orderBy('create_time', 'desc').skip(event.page * 20).limit(20).get()).data;
  for (let i = 0; i < list.length; i++) {
    let author = (await db.collection('user').where({ _id: list[i].author }).get()).data[0];
    list[i].author = author;
    let col;
    if (list[i].type === 'expend') {
      col = "tag_out";
    } else if (list[i].type === 'income') {
      col = "tag_in";
    };
    let tag = (await db.collection(col).where({ _id: list[i].tag }).get()).data[0];
    list[i].tag = tag;
  }
  return list;
}