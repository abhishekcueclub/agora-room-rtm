//https://codesandbox.io/s/react-basic-navigation-mk5lb?from-embed=&file=/src/routes/index.js:0-604
// https://javascript.plainenglish.io/routing-and-navigation-in-react-cffc26e8a389
import { Route, Routes as Switch } from 'react-router-dom';

import React from "react";
import RoomApp from "../../RoomApp";

export default function Routes() {
    return (
        // <Switch>
        <Route path="/" exact component={RoomApp} />
        // </Switch>
    );
}
