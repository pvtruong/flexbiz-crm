import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import AuthContext from "flexbiz-core/components/auth/Context";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {gradientBackgroundStyle} from "flexbiz-core/utils";
import TextField from '@material-ui/core/TextField';

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

import Rating from '@material-ui/lab/Rating';
import Portal from '@material-ui/core/Portal';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import _ from "lodash";
import Moment from "moment";
import { Button } from '@material-ui/core';
const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon />,
      label: 'Very Satisfied',
    },
};
function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}
  
IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};
class CustomRating extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            load:0,
            value:(this.props.value||0),
            hover:-1
        }
    }
    componentDidUpdate(oldProps){
        if(oldProps.value!==this.props.value){
            this.setState({value:this.props.value,load:this.state.load+1});
        }
    }
    render(){
        let {value,hover} = this.state;
        return (
            <>
                <Rating
                    size="large"
                    defaultValue={value}
                    getLabelText={value => customIcons[value].label}
                    IconContainerComponent={IconContainer}
                    onChange={(event, newValue)=>{
                        this.setState({value:newValue,load:this.state.load+1});
                        if(this.props.onChange){
                            this.props.onChange(newValue);
                        }
                    }}
                    onChangeActive={(event, newHover) => {
                        this.setState({hover:newHover,load:this.load+1});
                    }}
                />
                {value !== null && 
                    <Box ml={1}>
                        <Typography variant="caption">
                            {customIcons[hover !== -1 ? hover : value].label}
                        </Typography>
                    </Box>
                }
            </>
        )
    }
}
CustomRating.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number
};
class ItemInput extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            value:this.props.value||""
        }
    }
    render(){
        return (
            <TextField variant="outlined" value={this.state.value}
                label={this.props.placeholder}
                onChange={event=>{
                    this.setState({value:event.target.value})
                }}
                onKeyPress={ev=>{
                    if (ev.key === 'Enter') {
                        if(this.props.onAdd && !!this.state.value){
                            this.props.onAdd(this.state.value);
                        }
                        this.setState({value:""});
                        ev.preventDefault();
                    }
                }}
            />
        )
    }
}
ItemInput.propTypes = {
    onAdd: PropTypes.func,
    value: PropTypes.string,
    placeholder:PropTypes.string,
};
class ListInput extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            items:this.props.items||[],
            load:0
        }
    }
    render(){
        const {items} = this.state;
        return (
            <div>
                <ItemInput placeholder={this.props.placeholder} onAdd={value=>{
                    items.push({
                        line:new Date().getTime(),
                        title:value
                    });
                    this.setState({load:this.state.load+1});
                    if(this.props.onItemsChange){
                        this.props.onItemsChange(items);
                    }
                }}/>
                <ul style={{paddingLeft:15,paddingRight:5}}>
                    {items.map((item)=>{
                        return (
                            <li key={item.line}>
                                {item.title}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
ListInput.propTypes = {
    onItemsChange: PropTypes.func,
    items: PropTypes.array,
    placeholder:PropTypes.string,
};
class Person extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            data:null
        }
    }
    componentDidMount(){
        this.loadData();
    }
    async loadData(){
        let {person} = this.props;
        let datas = await this.context.apis.asyncGetList(this.context.userInfo.token,"experiencejourneydata",{condition:{id_persona:person._id},limit:10000},null,true);
        this.setState({datas})
    }
    renderTouchPoints(data,dataStage){
        return dataStage.data.touchpoints.map(point=>{
            let value = point.value || 3;
            return (
                <div key={point.line}>
                    <Box component="fieldset" mb={1} borderColor="transparent">
                        <Typography component="legend">{point.title}</Typography>
                        <CustomRating
                            value={value}
                            onChange={value=>{
                                point.value = value;
                                this.updateData(data);
                            }}
                        />
                    </Box>
                </div>
            )
       })
    }
    renderList(data,dataStage,placeholder){
        let items = dataStage.data;
        return <ListInput items={items} placeholder={placeholder} onItemsChange={()=>{
            this.updateData(data);
        }} />
    }
    updateData(data){
        this.context.apis.asyncPostList(this.context.userInfo.token,"experiencejourneydata",data)
    }
    deletePersona(){
        if(this.props.onRemove){
            this.props.onRemove();
        }
    }
    renderStage(data,stage){
        let stages = data.stages;
        if(!stages){
            data.stages = stages = [];
        }
        let dataStage = stages.find(s=>s.id_stage === stage._id);
        if(!dataStage){
            dataStage = _.cloneDeep(stage);
            dataStage.id_stage = stage._id;
            stages.push(dataStage);
        }
        switch(data.type){
            case "touchpoints":{
                dataStage.data = dataStage.data || {};
                if(!dataStage.data.touchpoints || dataStage.data.touchpoints.length===0) dataStage.data.touchpoints = stage.touchpoints ||[];
                return this.renderTouchPoints(data,dataStage);
            }
            case "emotions":{
                dataStage.data = dataStage.data || 0;
                return (
                    <Box component="fieldset" mb={0} borderColor="transparent">
                        <CustomRating
                            value={dataStage.data}
                            onChange={value=>{
                                dataStage.data = value;
                                this.updateData(data);
                            }}
                        />
                    </Box>
                )
            }
            case "list":{
                dataStage.data = dataStage.data || [];
                return this.renderList(data,dataStage,"+ " + data.title);
            }
            default:
                return dataStage.data||"";
        }
    }
    render(){
        let {datas} = this.state;
        if(!datas) return null;
        let {stages,person} = this.props;
        return (
            <>
                <TableRow>
                    <TableCell colSpan={stages.length+1}>
                        <div style={{display:"flex",alignItems:"center"}}>
                            <Typography style={{flexGrow:1}} variant="h5">{person.ten_kh || person.name}</Typography>
                            <Typography variant="caption">{this.context.apis.getLabel("Được tạo lúc")} {Moment(person.date_created).format("DD/MM/YYYY -HH:mm A")}</Typography>
                            <Button style={{marginLeft:10}} size="small" variant="outlined" onClick={()=>this.deletePersona(person)}>{this.context.apis.getLabel("Xoá")}</Button>
                        </div>
                    </TableCell>
                </TableRow>
                {datas.map(data=>{
                    return (
                        <TableRow  key={data._id}>
                            <TableCell style={gradientBackgroundStyle(this.context.config.secondaryColor)}>
                                {data.title}
                            </TableCell>
                            {stages.map(stage=>{
                                return (
                                    <TableCell key={stage._id} style={{verticalAlign: "top"}}>
                                        {this.renderStage(data,stage)}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    )
                })}
            </>
        )
    }
}
Person.contextType = AuthContext;
Person.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  person: PropTypes.object,
  journey: PropTypes.object,
  stages: PropTypes.array,
  onRemove: PropTypes.func,
  mediaQueryMatches: PropTypes.bool,
}
class View extends PureComponent{
  constructor(props){
    super(props);
    this.state={
        listInfo:null,
        InputBase:null,
        load:0
    }
  }
  async componentDidMount( ) {
    this.titleContainer = document.getElementById('view-title-container');
    const {default:InputBase} = await import("flexbiz-core/components/InputBase");
    this.setState({
      InputBase:InputBase,
      load:this.state.load+1
    },async ()=>{
        await this.loadListInfo();
    })
  }
  async loadListInfo(){
    const code= "experiencejourneypersona";
    this.context.setProgressStatus(true);
    try{
      let listInfo = await this.context.apis.asyncGetData(this.context.userInfo.token,"listinfo",{code:code.toLowerCase()},null,true);
      if(listInfo){
        //load journey
        let journey = await this.context.apis.asyncGetData(this.context.userInfo.token,"experiencejourney",{_id:this.props.idJourney},null,true);
        let stages = await this.context.apis.asyncGetList(this.context.userInfo.token,"experiencejourneystage",{condition:{id_journey:this.props.idJourney},limit:10000},null,true);
        //load stage
        //default data
        let defaultData = {
            id_journey:this.props.idJourney
        }
        let defaultCondition = {
            id_journey:this.props.idJourney
        }
        this.setState({code,journey,stages,listInfo,defaultData,defaultCondition,load:this.state.load+1});
      }else{
        this.context.setProgressStatus(false);
      }
    }catch(e){
      console.error(e)
      this.context.alert(e.message||e);
    }
  }
  render(){
    const {code,journey,stages,listInfo}  = this.state;
    return (
        <>
            {this.titleContainer && journey &&
                <Portal container={this.titleContainer}>
                    <span>{journey.title}</span>
                </Portal>
            }
            {listInfo &&
                <this.state.InputBase
                    fullScreen={this.props.mediaQueryMatches}
                    listInfo={listInfo}
                    code={code}
                    title={listInfo.title}
                    defaultData={this.state.defaultData}
                    defaultCondition={this.state.defaultCondition}
                    hideHeader={true}
                    ref={ref=>this._listPerson = ref}
                    rowsPerPage ={5}
                    showPages={true}
                    renderItems ={({rows})=>{
                        return(
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{padding:0}}>
                                            <TableCell style={{...gradientBackgroundStyle(this.context.config.secondaryColor),textAlign:"center",padding:0}}>
                                                {this.context.apis.getLabel("Giai đoạn hành trình")}
                                            </TableCell>
                                            {stages.map(stage=>{
                                                return (
                                                    <TableCell key={stage._id} style={{...gradientBackgroundStyle("#2395EA"),textAlign:"center",padding:0}}>
                                                        <div style={{display:"flex",alignItems:"center",overflow:"hidden",height:50}}>
                                                            <div style={{flexGrow:1}}>{stage.title}</div>
                                                            <ArrowForwardIosIcon style={{fontSize:80,marginRight:-10}}/>
                                                        </div>
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map(person=>
                                            <Person key={person._id} journey={journey} stages={stages} person={person} onRemove={()=>{
                                                this._listPerson.deleteItem(person);
                                            }}/>
                                        )}
                                    </TableBody>
                                    
                                </Table>
                            </TableContainer>
                        )
                    }}
                />
            }
        </>
    )
  }
}
View.contextType = AuthContext;
View.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  idJourney: PropTypes.string,
  mediaQueryMatches: PropTypes.bool,
}
export default  View;