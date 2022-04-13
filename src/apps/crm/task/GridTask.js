import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Container from '../Container';
import GridTask from 'flexbiz-core/components/task/GridTask';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
import AuthContext from "flexbiz-core/components/auth/Context";
import Counter from "flexbiz-core/components/Counter";
import ProfileChip from "flexbiz-core/components/auth/ProfileChip";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import _ from "lodash";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
class GridTaskCust extends Component{
    constructor(props){
        super(props);
        this.query = queryString.parse(this.props.location.search);
        let typeView = this.query.typeView;
        if(!typeView && this.query.nh_cv) typeView ="all";
        delete this.query.typeView;
        
        this.state={
            typeView: typeView||"phu_trach"
        }
    }
    search(q){
        this._gridTask.search(q);
    }
    handleViewChange(event, typeView){
        let currentGroup={}
        if(this.query.group_by && this._gridTask.currentGroup){
            currentGroup[this.query.group_by]= this._gridTask.currentGroup[this.query.group_by];
        }
        this.props.history.push({
            pathname: '/grid-task',
            search: "?" + new URLSearchParams({typeView: typeView,...this.query,...currentGroup}).toString()
        })
    }
    changeUser(){
        this.context.objectPicker("participant",this.context.apis.getLabel("Người sử dụng"),{
            props:{
                readOnly:true,
                formSize:"sm",
                hideTableHeader:true,
                hideHeader:true,
                showPages:false,
                renderItems:({rows,handleCellClicked})=>{
                    return (
                        <List>
                           {rows.map(row=>{
                                return (
                                    <ListItem button onClick={()=>handleCellClicked(row)} key={row.email}>
                                        <ProfileChip email={row.email}/>
                                    </ListItem>
                                ) 
                            })}
                        </List>
                    )
                    
                },
            },
            callback: async (rs)=>{
                let currentGroup={}
                if(this.query.group_by && this._gridTask.currentGroup){
                    currentGroup[this.query.group_by]= this._gridTask.currentGroup[this.query.group_by];
                }
                let typeView = this.state.typeView;
                this.props.history.push({
                    pathname: '/grid-task',
                    search: "?" + new URLSearchParams({typeView: typeView,...this.query,...currentGroup,user:rs.email}).toString()
                })
            }}
        )
    }
    render(){
        let user = this.query.user || this.context.userInfo.email;
        let defaultCondition = {},
            defaultData={},
            condition_phu_trach={phu_trach:user,saved:{$ne:true}},
            condition_attends={attends:user,phu_trach : {$ne:user},saved:{$ne:true}};
        //group by
        let group_by = this.query.group_by;
        let group_label = this.query.group_label;
        let group_title = this.query.group_title;
        let group_api_code = this.query.group_api_code;
        let group_api_field = this.query.group_api_field;

        let currentGroup;
        if(group_by && this.query[group_by]){
            currentGroup ={
                [group_by]:this.query[group_by]
            }
        }
        //type view
        if(this.state.typeView!=="all"){
            if(this.state.typeView==="phu_trach"){
                defaultCondition.phu_trach = user;
                //default data
                defaultData.phu_trach = user;
            }
            if(this.state.typeView==="attends"){
                defaultCondition.attends = user;
                defaultCondition.phu_trach = {$ne:user};
                //default data
                defaultData.attends = [user];
            }
            if(this.state.typeView==="saved"){
                defaultCondition.saved = true;
            }
        }
        condition_phu_trach={...this.query,...condition_phu_trach};
        condition_attends={...this.query,...condition_attends};

        defaultCondition={...defaultCondition,...this.query};
        defaultData = {...defaultData,...this.query};

        if(defaultData.attends && !_.isArray(defaultData.attends) ){
            defaultData.attends = [defaultData.attends]
        }
        let height = (this.props.mediaQueryMatches?"calc(100vh - 45px - 55px)":"calc(100vh - 65px - 65px)");

        let module_name = this.props.match.params.module;
        let paths = [];
        if(module_name){
            paths.push({to:"/m/" + module_name,title: this.context.apis.getLabel(module_name)})
        }
        if(defaultCondition.nh_cv){
            let group_task_name = this.context.menu.find(item=>item.code==="dmnhcv");
            if(group_task_name){
                paths.push({
                    to:`/m/${group_task_name.group}${group_task_name.path}`,title: this.context.apis.getLabel(group_task_name.title)
                })
            }
        }

        paths.push({
            title: defaultCondition.title || defaultCondition.ten_nh_cv||this.context.apis.getLabel("Bàn làm việc")
        })
        //removate condition what not need
        delete defaultCondition.user;
        delete defaultCondition.title;
        delete defaultCondition.group_by;
        delete defaultCondition.group_label; 
        delete defaultCondition.group_title; 
        delete defaultCondition.group_api_code;
        delete defaultCondition.group_api_field;

        delete condition_phu_trach.user;
        delete condition_phu_trach.title;
        delete condition_phu_trach.group_by;
        delete condition_phu_trach.group_label; 
        delete condition_phu_trach.group_title; 
        delete condition_phu_trach.group_api_code; 
        delete condition_phu_trach.group_api_field;

        delete condition_attends.user;
        delete condition_attends.title;
        delete condition_attends.group_by;
        delete condition_attends.group_label; 
        delete condition_attends.group_title; 
        delete condition_attends.group_api_code; 
        delete condition_attends.group_api_field;

        
        return (
            <>
                <div elevation={0} style={{padding:10,display:"flex",flexDirection:"row",alignItems:"center"}}>
                    <Breadcrumbs info={{paths:paths}}/>
                    <div style={{flex:1}}></div>
                    <Typography color="textPrimary">
                        <span id="view-title-container"></span>
                    </Typography>
                    <ProfileChip email={user} style={{marginRight:10}} onClick={this.changeUser.bind(this)}/>
                    <ToggleButtonGroup style={{marginLeft:10}}
                        value={this.state.typeView}
                        exclusive
                        size="small"
                        onChange={this.handleViewChange.bind(this)}
                        >
                        <ToggleButton value="phu_trach">
                            
                            {this.context.apis.getLabel("Phụ trách")} (<Counter code="task" condition={condition_phu_trach} style={{color:"red"}}/>)
                        </ToggleButton>
                        <ToggleButton value="attends">
                            {this.context.apis.getLabel("Hỗ trợ")} (<Counter code="task" condition={condition_attends}  style={{color:"red"}}/>)
                        </ToggleButton>
                        <ToggleButton value="saved">
                            {this.context.apis.getLabel("Đã lưu trữ")}
                        </ToggleButton>
                        <ToggleButton value="all">
                            {this.context.apis.getLabel("Tất cả")}
                        </ToggleButton>
                    </ToggleButtonGroup>
                
                </div>
                <Paper style={{overflow:"hidden",marginLeft:(this.props.mediaQueryMatches?0:10),marginRight:(this.props.mediaQueryMatches?0:10),marginBottom:(this.props.mediaQueryMatches?0:0),height:height}}  elevation={this.props.mediaQueryMatches?0:1}>
                    <GridTask ref={ref=>this._gridTask = ref} {...this.props} 
                        groupBy={group_by}
                        groupLabel={group_label} 
                        groupTitle={group_title} 
                        currentGroup={currentGroup} 
                        groupApiCode={group_api_code} 
                        groupApiField={group_api_field} 
                        defaultCondition={defaultCondition} 
                        defaultData={defaultData} 
                        style={{height:"100%"}}
                        onSelectGroup={(group)=>{
                            let currentGroup={}
                            delete this.query[this.query.group_by]
                            if(group[this.query.group_by]!==undefined) currentGroup[this.query.group_by]= group[this.query.group_by];

                            this.props.history.push({
                                pathname: '/grid-task',
                                search: "?" + new URLSearchParams({typeView: this.state.typeView,...this.query,...currentGroup}).toString()
                            })
                        }}
                    />
                </Paper>
            </>
        )
    }
}
GridTaskCust.contextType =AuthContext;
GridTaskCust.propTypes={
    match: PropTypes.any,
    history: PropTypes.any,
    location: PropTypes.any,
    mediaQueryMatches: PropTypes.bool,
}


class ListPage extends Component{
    constructor(props){
      super(props);
      this.state={
        placeholderSearch:""
      }
    }
    render(){
      return (
        <Container requireLogin {...this.props}  onSearch={(q)=>{
            this._list.search(q);
        }} placeholderSearch ={this.state.placeholderSearch || this.context.apis.getLabel("Tìm...")}>
          <GridTaskCust {...this.props} ref={ref=>this._list = ref} />
        </Container>
      )
    }
}
ListPage.contextType = AuthContext;
export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));