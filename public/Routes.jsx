import React from 'react'
import { Route, IndexRoute } from 'react-router'
import IndexPage from './App.jsx';
import CircleFormPage from './CircleForm.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const routes = (
	<Route path="/" /*component={Layout}*/>
		<IndexRoute component={IndexPage}/>
		<Route path="circleForm" component={CircleFormPage}/>
		<Route path="*" component={NotFoundPage}/>
	</Route>
);

export default routes;