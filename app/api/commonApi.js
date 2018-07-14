import appConf from '../conf';
import {message} from 'antd';
const sendPost = (path, method='get', isJson=false, params, onError) => {
    // const sendParams = method=='get'?{params}:params;
    const sendParams = params;
    const config_id = sessionStorage.getItem('config_id');
    if (config_id === null && path.indexOf('/supermind/api/index') < 0) {
        location.href = '#/error/nodomain'
        return
    }
    const proxyParams = {
        params: sendParams,
        rest: {
            config_id
        },
        keyPath: path,
        method
    }
    if (isJson){
        return axios.get(
            path
        )
        .then(res=>{
            const {data: {header,body}} = res;
            // return header.code === '0' || header.code === 0 ? {body} : {status: false, message: message, data: {}}
            if (header.code === '0' || header.code === 0) {
                return body || {}
            }
            if (onError) {
                onError(header);
            }else {
                // error message todo
                console.log(header.message);
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }else {
        return axios.post(
            // isJson?path:URL+path,
            appConf.SERVER_URL,//这一步可以走web-dev-server代理
            proxyParams
        )
        .then(res=>{
            const {data: {header,body}} = res;
            // return header.code === '0' || header.code === 0 ? {body} : {status: false, message: message, data: {}}
            if (!header && !body) {
                return res
            }
            if (header.code === '0' || header.code === 0) {
                return body || {}
            }
            if (onError) {
                onError(header);
            }else {
                // error message todo
                message.error(header.message)
                // console.log(header.message);
            }
            return undefined
        })
        .catch(err=>{
            console.log(err);
        });
    }
}



async function getServerUrl(params={}){
    const result = await sendPost('/supermind/api/getServerUrl', 'post', false, params);
    return result
};

export {getServerUrl}

export default sendPost
