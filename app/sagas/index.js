import typesystemSaga from './typesystemSaga';
import datafusionSaga from './datafusionSaga';
import knowledgegraphSaga from './knowledgegraphSaga';
import homepageSaga from "./homepageSaga";
import artificialcorrection from "./artificialcorrectionSaga";
import labelSaga from "./labelSaga";

function* rootSaga() {
    //watch typesystem async
    yield [
        typesystemSaga(),
        datafusionSaga(),
        knowledgegraphSaga(),
        homepageSaga(),
        artificialcorrection(),
        labelSaga()
    ];
}

export default rootSaga;
