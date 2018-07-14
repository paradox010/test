import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import typesystemApi from 'app_api/typesystemApi';
import {Map} from 'immutable';

function* initTypesystem() {
    try {
        const taglist = yield call(typesystemApi.getTagList);
        yield put({type: 'typesystem/GET_TAGLIST_OK', payload: taglist});
        const currentTab = yield select(state => state.get('typesystem').get('currentTab'));
        const tag = taglist[currentTab][0];
        yield call(handleEditTag, tag);
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* search({params}) {
    try {
        const data = yield call(typesystemApi.search, params);
        const prevKeyword = yield select(state => state.get('typesystem').get('prevKeyword'));
        yield call(canelCurrentEditHandle, {type: 'typesystem/CHANGE_SEARCH_KEYWORD', searchKeyword: prevKeyword});
        yield put({type: 'typesystem/RESET_TAGLIST'});
        yield put({type: 'typesystem/SEARCH_OK', payload: {list: data.result, keyword: params.keyword}});
        const tag = data.result[0];
        yield call(handleEditTag, tag);
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }
}
//取消当前编辑
function* canelCurrentEditHandle(handle) {
    const needCheck = yield select(state => state.get('typesystem').get('currentFormIsUpdate'));
    console.log('handle值：', needCheck); //当前表单更新状态false
    if (needCheck) {
        yield put({type: 'typesystem/TRIGGER_CHECK_MODAL', isShow: true});       
        const action = yield take('typesystem/NEED_CLOSE_EDIT_AREA');
        yield put({type: 'typesystem/TRIGGER_CHECK_MODAL', isShow: false});
        // yield cancel(listenCancel);
        if (action.flag) return true
        else {
            if (handle) {
                yield put(handle);
            }
            return false
        }
    }else {
        return true
    }
}
//切换列表
function* changeTab({currentTab}) {
    //currentTab: eventType
    const taglist = yield select(state => state.get('typesystem').get('tagList').toJS());
    const tag = taglist[currentTab][0]; //获取当前类目的列表值
    
    if (tag) {
        const flag = yield call(handleEditTag, tag);
        if (flag) {
            yield put({type: 'typesystem/CHANGE_TAB', currentTab});
            yield put({type: 'typesystem/CLEAN_SEARCH_LIST'});
        }
    }else {
        yield call(cancelSelectedTag);
        yield put({type: 'typesystem/CHANGE_TAB', currentTab});
    }

}

function* handleEditTag(tag) {
    console.log('tag', tag);
    const flag = yield call(canelCurrentEditHandle);

    if (flag) {
        //设置当前的tag相关的值。
        yield put({type: 'typesystem/CHANGE_ACTIVE_TAG', tag: {value: tag.value, label: tag.label, index: 0}});
        //设置getTagDesc的入参mongoId的值。
        const params = {mongoId: tag.value};
        try {
            const data = yield call(typesystemApi.getTagDesc, params);
            yield put({type: 'typesystem/SET_EDIT_VALUE', payload: data});
        } catch(error){
            yield put({type: 'FETCH_FAILED', error});
        }
    }
    return flag
}

function* cancelSelectedTag(){
    yield put({type: 'typesystem/RESET_TAGLIST'}); //activeTag、activeTagName、currentTagIndex
    yield put({type: 'typesystem/RESET_FIELD_VALUES'}); //formData、currentFormIsUpdate:true
    yield put({type: 'typesystem/CANCEL_SELECTED_TAG'}); //lastFormData、currentFormIsUpdate:false
}

function* editTag({tag, index}) {
    const typesystem = yield select(state => state.get('typesystem').toJS()); //获取typesystem值
    const {activeTag, currentTab, currentFormIsUpdate} = typesystem;
    let flag = true;
    if (currentFormIsUpdate) {//当前项是否更新
        flag = yield call(canelCurrentEditHandle);
    }
    if (flag) {
        if (activeTag === tag.value) {
            yield call(cancelSelectedTag);
        }else {
            yield put({type: 'typesystem/CHANGE_ACTIVE_TAG', tag: {value: tag.value, label: tag.label, index}});
            const params = {mongoId: tag.value};
            try {
                const data = yield call(typesystemApi.getTagDesc, params);
                yield put({type: 'typesystem/SET_EDIT_VALUE', payload: data});
            } catch(error){
                yield put({type: 'FETCH_FAILED', error});
            }
        }
    }
}

function* deleteTag({args:{info, CB}}) {
    const flag = yield call(canelCurrentEditHandle);
    if (flag) {
        const typesystem = yield select(state => state.get('typesystem').toJS());
        const {activeTag, currentTab, currentTagIndex} = typesystem;
        const params = {mongoId: info.value};
        try {
            yield call(typesystemApi.deleteTag, params);
            //删除成功
            CB();
            // const currentTag = yield select(state => state.getIn(['typesystem', 'tagList', currentTab, info.index===0?1:0]));
            const currentTagList = yield select(state => state.getIn(['typesystem', 'tagList', currentTab]));
            const newCurrentTagList = currentTagList.splice(info.index, 1);
            yield put({type: 'typesystem/UPADTE_TAGLIST', payload: {newCurrentTagList, currentTab}});
            yield call(editTag, {tag: {value:newCurrentTagList.getIn([0, 'value']), label: newCurrentTagList.getIn([0, 'label'])}, index: 0})
        } catch(error){
            yield put({type: 'FETCH_FAILED', error});
        }
    }
}

function* addTag(action){
    const currentTab = yield select(state => state.getIn(['typesystem', 'currentTab']));
    const params = {...action.fieldvalues, type: currentTab};
    try {
        const tagValue = yield call(typesystemApi.addTag, params);
        if (tagValue) {
            let typeName = action.fieldvalues.typeName;
            if (currentTab === 'relationType') {
                typeName = typeName + `（${action.fieldvalues.entityType_start.typeName} - ${action.fieldvalues.entityType_end.typeName}）`;
            }
            //添加成功
            action.CB();
            const currentTagList = yield select(state => state.getIn(['typesystem', 'tagList', currentTab]));
            const newCurrentTagList = currentTagList.push(Map({key: tagValue, value: tagValue, label: typeName}));
            yield put({type: 'typesystem/UPADTE_TAGLIST', payload: {newCurrentTagList, currentTab}});
            yield put({type: 'typesystem/COMMON_MERGE_STATE', payload: {currentFormIsUpdate: false, activeTag: tagValue, activeTagName: typeName, currentTagIndex: currentTagList.size}})
        }
    } catch(error){
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* updateTag(action){
    const currentTab = yield select(state => state.getIn(['typesystem', 'currentTab']));
    const activeTag = yield select(state => state.getIn(['typesystem', 'activeTag']));
    const currentTagIndex = yield select(state => state.getIn(['typesystem', 'currentTagIndex']));
    const params = {...action.fieldvalues, type: currentTab, mongoId:activeTag};
    try {
        const tagValue = yield call(typesystemApi.updateTag, params);
        if (tagValue) {
            let typeName = action.fieldvalues.typeName;
            if (currentTab === 'relationType') {
                typeName = typeName + `（${action.fieldvalues.entityType_start.typeName} - ${action.fieldvalues.entityType_end.typeName}）`;
            }
            //添加成功
            action.CB();
            const currentTagList = yield select(state => state.getIn(['typesystem', 'tagList', currentTab]));
            const newCurrentTagList = currentTagList.setIn([currentTagIndex, 'label'], typeName);
            yield put({type: 'typesystem/UPADTE_TAGLIST', payload: {newCurrentTagList, currentTab}});
            yield put({type: 'typesystem/COMMON_MERGE_STATE', payload: {currentFormIsUpdate: false, activeTagName: typeName}})
        }
    } catch(error){
        yield put({type: 'FETCH_FAILED', error});
    }
}

function* wantAddTag(){
    const needCheck = yield select(state => state.get('typesystem').get('currentFormIsUpdate'));
    let flag = true;
    console.log('needCheck', needCheck);
    if (needCheck) { //获取当前form是否更新
        flag = yield call(canelCurrentEditHandle);
    }
    //
    if (flag) {
        yield put({type:'typesystem/TO_DO_EIDT'}); //isEdit: true
        yield call(cancelSelectedTag); 
        console.log(this);
    }
}

function* watchCreateLesson() {
    yield[
        takeLatest('typesystem/saga/GET_TARGET_LIST', initTypesystem),
        takeLatest('typesystem/saga/SEARCH', search),
        takeLatest('typesystem/saga/CHANGE_TAB', changeTab),
        takeLatest('typesystem/saga/EDIT_TAG', editTag),
        takeLatest('typesystem/saga/DELETE_TAG', deleteTag),
        takeLatest('typesystem/saga/ADD_TAG', addTag),
        takeLatest('typesystem/saga/UPDATE_TAG', updateTag),
        takeLatest('typesystem/saga/WANT_ADD_TAG', wantAddTag)

    ];
}


export default function* typesystemSaga() {
    yield watchCreateLesson()
}
