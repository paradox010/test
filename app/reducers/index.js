import { combineReducers } from 'redux-immutable';
//import undoable from 'redux-undo'

import typesystem from './typesystem';
import datafusion from './datafusion';
import datafusionChildDbAdd from './datafusionChildDbAdd';
import datafusionChildDbEdit from './datafusionChildDbEdit';
import datafusionChildDmlAdd from './datafusionChildDmlAdd';
import datafusionChildDmlEdit from './datafusionChildDmlEdit';
import knowledgegraph from './knowledgegraph';
import homepage from "./homepage";
import artificialcorrection from "./artificialcorrection";
import label from "./label";
import graphdata from "./graphdata";

const rootReducer = combineReducers({
    typesystem: typesystem,
    datafusion: datafusion,
    datafusionChildDbAdd: datafusionChildDbAdd,
    datafusionChildDbEdit: datafusionChildDbEdit,
    datafusionChildDmlAdd: datafusionChildDmlAdd,
    datafusionChildDmlEdit: datafusionChildDmlEdit,
    knowledgegraph: knowledgegraph,
    homepage: homepage,
    artificialcorrection: artificialcorrection,
    label:label,
	graphdata:graphdata,
});

export default rootReducer;
