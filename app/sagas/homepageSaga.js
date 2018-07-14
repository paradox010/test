import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import homepageApi from 'app_api/homepageApi';

function* initHomePage() {
    try {
        // debugger;
        const homeList = yield call(homepageApi.homePageInfo);
        yield put({type: 'homepage/GET_LIST_OK', payload: homeList});
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}
function* editHomePageList(params){
    try{
        const editList = yield call(homepageApi.homePageEditInfo, params.params);
        yield put({type:"homePage/EDIT_LIST_OK",result:editList})
    }catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}
function* addHomePageList(params){
    try{
        const addList = yield call(homepageApi.homePageAdd, params.params);
        yield put({type:"homePage/ADD_LIST_OK",result:addList});
        yield call(initHomePage);
    }catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}
function* deleteItem(params){
    try{
        const addList = yield call(homepageApi.deleteItem,params.params);
        const data = yield select(state=>state.getIn(['homepage',"infoList"]));
        const newData =[];
        data.map((item)=>{
            if(item.configItem.id!==params.params.id){
                newData.push(item)
            }
        })
        yield put({type: 'homepage/GET_LIST_OK', payload: newData});
    }catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* watchCreateLesson() {
    yield[
        takeLatest('homepage/saga/GET_LIST', initHomePage),
        takeLatest('homepage/saga/EDIT_LIST',editHomePageList),
        takeLatest('homepage/saga/ADD_LIST',addHomePageList),
        takeLatest('homepage/saga/DELETE_ITEM',deleteItem)

    ];
}


export default function* homepageSaga() {
    yield watchCreateLesson()
}
