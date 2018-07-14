import sendPost from './commonApi';

export default class labelApi{
    //获取事件模板
    static async addNullTemplate(params={}){
        const result = await sendPost('/supermind/api/manual/getEventTemplate','post',false,params);
        return result;
    };
//    获取事件列表[获取事件列表]
    static async getEventList(params={}){
        const result = await sendPost('/supermind/api/manual/getDocOne','post',false,params.args);
        return result;
    };
//    新增事件
    static async insertEvent(params={}){
        const result = await sendPost('/supermind/api/manual/insertEvent',"post",false,params.args)
        console.log(result);
    }
//    删除事件
    static async deleteEvent(params={}){
        const result = await sendPost('/supermind/api/manual/deleteEvent','post',false,params.args)
        console.log(result);
    }
//    更新事件
    static async updateEvent(params={}){
        const result = await sendPost('/supermind/api/manual/updateEvent','post',false,params.args)
        console.log(result);
    }
//    获取更多文档
    static async getMoreDoc(params={}){
        const result = await sendPost('/supermind/api/manual/getDocListOther','post',false,params.args);
        return result;
    }
}