import sendPost from "./commonApi";

export default class homepageApi{
    //获取列表信息
    static async homePageInfo(params={}){
        const InfoList = await sendPost('/supermind/api/index/getIndexList', 'post', false, params);
        // console.log('fallback：', InfoList);
        return InfoList;
    }
    //修改
    static async homePageEditInfo(params={}){
        const editInfo = await sendPost('/supermind/api/index/updateOne','post',false,params);
        return editInfo;
    }
    //新增
    static async homePageAdd(params={}){
        const newInfoList = await sendPost('/supermind/api/index/insertOne','post',false,params);
        return newInfoList;
    }
//    删除
    static async deleteItem(params={}){
        const result = await sendPost('/supermind/api/index/deleteOne','post',false,params);
        return result;
    }
}
