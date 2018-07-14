import sendPost from './commonApi';
import moment from 'moment';

export default class knowledgegraphApi {

    static async selectConceptByPid(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectConceptByPid', 'get', false, params);
        if (result === undefined) {
            return []
        }
        return result
    };

    static async selectEventTemplateByPid(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectEventTemplateByPid', 'get', false, params);
        if (result === undefined) {
            return []
        }
        return result
    };
    
    static async selectConceptById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectConceptById', 'get', false, params);
        return result
    };

    static async selectEventTemplateById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectEventTemplateById', 'get', false, params);
        return result
    };

    //更新当前概念
    static async updateConceptBaseInfoById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateConceptBaseInfoById', 'post', false, params);
        return result
    };
    static async updateEventTemplateBaseInfoById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateEventTemplateBaseInfoById', 'post', false, params);
        return result
    };

    //在当前概念节点下面新增一条子概念 ok
    static async insertConceptReturnId(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/insertConceptReturnId', 'post', false, params);
        return result
    };
    //新建一条子事件
    static async insertEventTemplateReturnId(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/insertEventTemplateReturnId', 'post', false, params);
        return result
    };

    //删除当前id的概念
    static async deleteConceptById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/deleteConceptById', 'get', false, params);
        return result
    };

    static async deleteEventTemplateById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/deleteEventTemplateById', 'get', false, params);
        return result
    };

    //事件列表 --- 根据当前事件类型获取对应事件列表
    static async listEventByType(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/listEventByType', 'get', false, params);
        // const data = result.map((item,index)=>{
        //     return {
        //         entities:item.entities,
        //         eventName: item.eventType,
        //         eventTime: item.eventTime?moment(item.eventTime).format('YYYY-MM-DD'):'暂无',
        //         title: item.resourceInfo.title,
        //         url: item.resourceInfo.url,
        //         key: item.resourceId,
        //         deleteId:item.id,
        //         index:index
        //     }
        // });
        const data = result.eventList.map(item=>{
            return {
                ...item,
                key: item.id
            }
        })
        let resultData={};
        resultData['entityItemCount']=result.eventCount;
        resultData['entityItemList']=data;
        return resultData
    };

    //查看当前实体的实例
    static async selectEntityByPid(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectEntityByPid', 'get', false, params);
        const data = result.entityItemList.map(item=>{
            return {
                ...item,
                key: item.id
            }
        })
       let resultData={};
        resultData['entityItemCount']=result.entityItemCount;
        resultData['entityItemList']=data;
        return resultData
    };

    //更新概念下面的关系 step1
    static async updateRelationOrAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateRelationOrAttribute', 'post', false, params);

        return result
    };

    static async updateRoleOrAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateRoleOrAttribute', 'post', false, params);

        return result
    };


    //更新概念下面的关系 step2
    static async updateConceptAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateConceptAttribute', 'post', false, params);

        return result
    };

    static async updateEventTemplateAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateEventTemplateAttribute', 'post', false, params);

        return result
    };

    //新增概念下面的关系
    static async insertRelationOrAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/insertRelationOrAttribute', 'post', false, params);

        return result
    };
    static async insertRoleOrAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/insertRoleOrAttribute', 'post', false, params);

        return result
    };



    //在快速添加时调用，获取推荐的属性
    static async selectRecommendRelationOrAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectRecommendRelationOrAttribute', 'get', false, params);

        return result
    };

    static async selectRecommendRoleOrAttribute(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/selectRecommendRoleOrAttribute', 'get', false, params);

        return result
    };


    //上传文件
    static async importEntityInstance(params={}){
        // const result = await sendPost('/supermind/api/knowledgeGraph/importEntityInstance', 'get', false, params);
        //
        // return result
        //
        // await axios.post('http://localhost:7771/supermind/api', params.formData, {
        //       headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //       }
        // });
    };

    //新增概念下面的实例
    static async insertEntity(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/insertEntity', 'post', false, params);

        return result
    };

    //新增概念下面的实例
    static async updateEntity(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/updateEntity', 'post', false, params);

        return result
    };

    //新增概念下面的实例
    static async deleteEntityById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/deleteEntityById', 'get', false, params);

        return result
    };
    //事件删除
    static async deleteEventById(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/deleteEventById','get',false,params);
        return result;
    }

    // static async exportEntityInstance(params={}){
    //     const result = await sendPost('/supermind/api/knowledgeGraph/exportEntityInstance', 'get', false, params);
    //     return result
    // };

	//图表api
	static async resetGraph(params={}){
		
        const result = await sendPost('/supermind/api/knowledgeGraph/getCoreGraph','post',false,params);
        return result;
    }
	static async expandGraph(params={}){
        const result = await sendPost('/supermind/api/knowledgeGraph/getExpandedGraph','post',false,params);
        return result;
    }
}
