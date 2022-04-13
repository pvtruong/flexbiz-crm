import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import AuthContext from "flexbiz-core/components/auth/Context";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CardActionArea from '@material-ui/core/CardActionArea';
import {gradientBackgroundStyle} from "flexbiz-core/utils";
import Portal from '@material-ui/core/Portal';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AdjustIcon from '@material-ui/icons/Adjust';
import {IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import OrkDiagram from "flexbiz-core/components/okr/OkrDiagram";
class TouchPoints extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            stage:this.props.stage,
            journey:this.props.journey,
            current:null,
            selected:this.props.selected
        }
    }
    componentDidUpdate(props){
        if(props.selected!==this.props.selected){
            this.setState({selected:this.props.selected})
        }
    }
    render(){
        const touchpoints = (this.state.stage.touchpoints||[])
        const journey = this.props.journey;
        return (
            <div>
                <div style={{display:"flex"}}>
                    {touchpoints.map(point=>{
                        let color = (journey.color || "#F8D104");
                        if(this.state.current && this.state.selected && this.state.current.line===point.line){
                            color = this.context.apis.config.secondaryColor
                        }
                        return (
                            <div key= {point.line} style={{display:"flex",flexDirection:"column", alignItems:"center"}}>
                                <IconButton size="small" onClick={()=>{
                                    this.setState({
                                        current:point
                                    })
                                    if(this.props.onCham) this.props.onCham(this.state.stage, point)
                                }}>
                                    <AdjustIcon style={{color:color}}/>
                                </IconButton>
                                <Typography component="div" className="vertical-text" style={{color:color}}>
                                    {point.title}
                                </Typography>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
TouchPoints.contextType = AuthContext;
TouchPoints.propTypes = {
    stage: PropTypes.object.isRequired,
    journey: PropTypes.object.isRequired,
    onCham:PropTypes.func,
    selected:PropTypes.bool
};
class Setup extends PureComponent{
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
    this.actionsContainer = document.getElementById('view-actions-container');
    const {default:InputBase} = await import("flexbiz-core/components/InputBase");
    this.setState({
      InputBase:InputBase,
      load:this.state.load+1
    },async ()=>{
        await this.loadListInfo();
    })
  }
  async loadListInfo(){
    this.context.setProgressStatus(true);
    const code ="experiencejourneystage";
    try{
        let stagesInfo = await this.context.apis.asyncGetData(this.context.userInfo.token,"listinfo",{code:code.toLowerCase()},null,true);
      if(stagesInfo){
        //load journey
        let journey = await this.context.apis.asyncGetData(this.context.userInfo.token,"experiencejourney",{_id:this.props.idJourney},null,true);
        //load stage
        //default data
        let defaultData = {
            id_journey:this.props.idJourney
        }
        let defaultCondition = {
            id_journey:this.props.idJourney
        }
        this.setState({code,journey,stagesInfo,defaultData,defaultCondition,load:this.state.load+1});
      }else{
        this.context.setProgressStatus(false);
      }
    }catch(e){
      console.error(e)
      this.context.alert(e.message||e);
    }
  }
  handleTouchPoint(currentStage,currentPoint){
    this.setState({currentStage,currentPoint,load:this.state.load+1})
  }
  render(){
    const {journey,stagesInfo,code,currentPoint,currentStage}  = this.state;
    return (
        <>
            {this.titleContainer && journey &&
                <Portal container={this.titleContainer}>
                    <span>{journey.title}</span>
                </Portal>
            }
            {stagesInfo &&
                <this.state.InputBase
                    fullScreen={this.props.mediaQueryMatches}
                    listInfo={stagesInfo}
                    code={code}
                    title={stagesInfo.title}
                    defaultData={this.state.defaultData}
                    defaultCondition={this.state.defaultCondition}
                    hideHeader={true}
                    readOnly={true}
                    ref={ref=>this._stage = ref}
                    rowsPerPage ={100000}
                    renderItems ={({rows})=>{
                        let style = gradientBackgroundStyle("#2395EA");
                        return(
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{padding:0}}>
                                            <TableCell style={{...gradientBackgroundStyle(this.context.config.secondaryColor),textAlign:"center",padding:0}}>
                                                {this.context.apis.getLabel("Giai đoạn hành trình")}
                                            </TableCell>
                                            {rows.map((stage)=>{
                                                return (
                                                    <TableCell key={stage._id} style={{...style,textAlign:"center",padding:0}}>
                                                        <CardActionArea onClick={()=>{
                                                                this._stage.quickEdit(stage);
                                                            }}>
                                                            <div style={{height:50,position:"relative",overflow:"hidden"}} >
                                                                <div style={{height:"100%",display:"flex",justifyContent:"center",alignItems:"center",padding:0}}>
                                                                    <Typography variant="subtitle2" style={{flexGrow:1,padding:5,paddingRight:30}} component="div">{stage.title}</Typography>
                                                                </div>
                                                                <ArrowForwardIosIcon style={{fontSize:80,position:"absolute",right:-20,top:-15}}/>
                                                            </div>
                                                        </CardActionArea>
                                                    </TableCell>
                                                )
                                            })}
                                            <TableCell style={{...style,textAlign:"center",padding:0}}>
                                                <div style={{display:"flex",alignItems:"center",overflow:"hidden",height:50}}>
                                                    <IconButton size="small" onClick={()=>{
                                                        this._stage.quickAdd({stt:(rows.length>0?rows[rows.length-1].stt +5:1)});
                                                    }}>
                                                        <AddCircleOutlineIcon style={{color:style.color}}/>
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow style={{padding:0}}>
                                            <TableCell style={gradientBackgroundStyle(this.context.config.secondaryColor)}>
                                                {this.context.apis.getLabel("Các điểm chạm")}
                                            </TableCell>
                                            {rows.map(stage=>{
                                                return (
                                                    <TableCell key={stage._id}  style={{verticalAlign: "top",textAlign:"left",paddingRight:50,backgroundColor:"white"}}>
                                                        <TouchPoints selected={currentStage && currentStage._id===stage._id} stage={stage} journey={journey} onCham={(stage,point)=>this.handleTouchPoint(stage,point)}/>
                                                    </TableCell>
                                                )
                                            })}
                                            <TableCell style={{backgroundColor:"white"}}>
                                                
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    }}
                />
            }
            {!!currentStage && !!currentPoint &&
            <div>
                <OrkDiagram {...this.props} idLink={`${currentStage._id}-${currentPoint.line}`} title ={`${currentStage.title}: ${currentPoint.title}`} />
            </div>}
        </>
    )
  }
}
Setup.contextType = AuthContext;
Setup.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  idJourney: PropTypes.string,
  mediaQueryMatches: PropTypes.bool,
}
export default  Setup;