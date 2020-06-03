import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import CreatePoint from './CreatePoint';

const Routes = () => {
    return <BrowserRouter>
        <Route path={"/"} component={Home} exact />
        <Route path={"/cadastro"} component={CreatePoint} />
    </BrowserRouter>
}

export default Routes;