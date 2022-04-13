// eslint-disable-next-line no-unused-vars
import React from 'react';
import Home from './Home';
import DashboardExt from './DashboardExt';

import Bmc from './bmc/Bmc';

import Module from './Module';
import AppInfo from './AppInfo';
import List from './general/List';
import ListExt from './general/ListExt';

import Voucher from './general/Voucher';
import Report from './general/Report';
import T from './T';
import notfound from './NotFound';
import TimelineTask from './task/TimelineTask';
import GranttTask from './task/GranttTask';
import GroupTask from './task/GroupTask';
import GridTask from './task/GridTask';
import ViewTask from './task/ViewTask';
import View from './View';
import Chat from './Chat';
import Checkin from './Checkin';
import Diagram from './Diagram';
import DiagramExt from './DiagramExt';

import OkrDiagram from './okr/OkrDiagram';
import OkrView from './okr/OkrView';
import KeyresultView from './okr/KeyresultView';



import StrategicDiagram from './strategic/StrategicDiagram';
import StrategicPlanView from './strategic/StrategicPlanView';
import StrategickpiView from './strategic/StrategickpiView';
import StrategicGoalView from './strategic/StrategicGoalView';
import StrategicObjectiveView from './strategic/StrategicObjectiveView';

import experiencejourneyData from './experiencejourney/DataPage';
import experiencejourneySetup from './experiencejourney/SetupPage';


import cau_truc_doanh_nghiep from './hrm/cau_truc_doanh_nghiep';

const routes=[
    {
        id:'home',
        path: "/",
        component: Home,
        exact:true
    },
    {
        id:'dashboard',
        path: "/dashboard",
        component: Home,
        exact:true
    },
    {
        id:'DashboardExt',
        path: "/dashboard-ext",
        component: DashboardExt,
        exact:true
    },
    {
        id:'bmc',
        path: "/bmc/:id",
        component: Bmc
    },
    {
        id:'chat',
        path: "/chat",
        component: Chat,
    },
    {
        id:'checkin',
        path: "/checkin",
        component: Checkin,
    },
    {
        id:'diagram',
        path: "/diagram/:id",
        component: Diagram,
    },
    {
        id:'diagram-ext',
        path: "/diagram-ext/:id",
        component: DiagramExt,
    },
    //experience journey
    {
        id:'experiencejourneyView',
        path: "/experience-journey/data/:idJourney",
        component: experiencejourneyData,
    },
    {
        id:'experiencejourneySetup',
        path: "/experience-journey/setup/:idJourney",
        component: experiencejourneySetup,
    },
    //strategic
    {
        id:'strategicdiagram',
        path: "/strategicdiagram/:id_link",
        component: StrategicDiagram,
    },
    {
        id:'strategicplan',
        path: "/strategicplan/:_id",
        component: StrategicPlanView,
    },
    {
        id:'strategicgoal',
        path: "/strategicgoal/:_id",
        component: StrategicGoalView,
    },
    {
        id:'strategicobjective',
        path: "/strategicobjective/:_id",
        component: StrategicObjectiveView,
    },
    {
        id:'strategickpi',
        path: "/strategickpi/:_id",
        component: StrategickpiView,
    },
    //strategic okr
    {
        id:'okr',
        path: "/okrdiagram/:id_link",
        component: OkrDiagram,
    },
    {
        id:'okr',
        path: "/okr/:_id",
        component: OkrView,
    },
    {
        id:'keyresultview',
        path: "/keyresult/:_id",
        component: KeyresultView,
    },
    //hrm
    {
        id:'cau_truc_doanh_nghiep',
        path: "/cau_truc_doanh_nghiep",
        component: cau_truc_doanh_nghiep,
    },
    //list
    {
        id:'m-list',
        path: "/m/:module/diagram/:id",
        component: Diagram,
        exact:true
    },
    {
        id:'m-list',
        path: "/m/:module/list/:code",
        component: List,
        exact:true
    },
    //voucher
    {
        id:'m-voucher',
        path: "/m/:module/voucher/:code",
        component: Voucher,
        exact:true
    },
    {
        id:'voucher',
        path: "/voucher/:code",
        component: Voucher,
    },
     //report
    {
        id:'m-report',
        path: "/m/:module/report/:code",
        component: Report,
        exact:true
    },
    {
      id:'report',
      path: "/report/:code",
      component: Report,
    },
    //crm
    {
        id:'timelinetask',
        path: "/m/:module/timeline-task",
        component: TimelineTask,
    },
    {
        id:'timelinetask',
        path: "/timeline-task",
        component: TimelineTask,
    },
    {
        id:'grantttask',
        path: "/m/:module/grantt-task",
        component: GranttTask,
    },
    {
        id:'grantttask',
        path: "/grantt-task",
        component: GranttTask,
    },
    {
        id:'grouptask',
        path: "/m/:module/group-task",
        component: GroupTask,
    },
    {
        id:'grouptask',
        path: "/group-task",
        component: GroupTask,
    },
    {
        id:'gridtask',
        path: "/m/:module/grid-task",
        component: GridTask,
    },
    {
        id:'gridtask',
        path: "/grid-task",
        component: GridTask,
    },
    {
        id:'viewtask',
        path: "/task/:_id",
        component: ViewTask,
    },
    {
        id:'module',
        path: "/m/:module",
        component: Module,
        exact:true
    },
    {
        id:'t',
        path: "/t/:code",
        component: T,
    },
    {
        id:'list',
        path: "/list/:code",
        component: List,
    },
    {
        id:'ListExt',
        path: "/list-ext/:code",
        component: ListExt,
    },
    {
        id:'view',
        path: "/view/:code/:_id",
        component: View,
    },
    //system
    {
        id:'appInfo',
        path: "/m/:module/system/appinfo",
        component: AppInfo,
    },
    {
        id:'appInfo',
        path: "/system/appinfo",
        component: AppInfo,
    },
    {
        id:'404',
        path: "/404",
        component: notfound,
        exact: true,
    },
]
export default routes;
