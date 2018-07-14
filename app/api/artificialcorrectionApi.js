import sendPost from './commonApi';

export default class artificialcorrectionApi{
    static async getDocConceptList(params={}){
        const result = await sendPost('/supermind/api/manual/getDocConceptList','post',false,params);
        return result;
    }
    static async getTableContent(params={}){
        const result = await sendPost('/supermind/api/manual/getDocList','post',false,params.args);
        return result;
    }
    static async selectConceptByPid(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectConceptByPid', 'get', false, params);
        return result
    };
}