import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AuthContext from "flexbiz-core/components/auth/Context";
import {gradientBackgroundStyle} from "flexbiz-core/utils"
import Frag from "flexbiz-core/components/Frag";
import EditIcon from '@material-ui/icons/Edit';
const code ="experiencejourney"
class Dashboard extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            defaultCondition:null,
            defaultData:null,
            listInfo:null,
            load:0
        }
    }
    async componentDidMount() {
        const {default:InputBase} = await import("flexbiz-core/components/InputBase");
        this.setState({
            InputBase
        },()=>{
            this.loadListInfo();
        })
    }
    async loadListInfo(){
        this.context.setProgressStatus(true);
        try{
            let listInfo = await this.context.apis.asyncGetData(this.context.userInfo.token,"listinfo",{code:code.toLowerCase()},null,true);
            if(listInfo){
                this.setState({code:code,listInfo:listInfo});
            }else{
                this.context.setProgressStatus(false);
                this.props.history.push(`/404`);
            }
        }catch(e){
            this.context.setProgressStatus(false);
        }
    }
    render(){
       return (
           <Frag title={this.context.apis.getLabel("Hành trình trải nghiệm")} actions={
                <>
                    <Button variant="outlined" size="small" onClick={()=>{
                        this._list.quickAdd({})
                    }}>
                        {this.context.apis.getLabel("+ Hành trình trải nghiệm mới")}
                    </Button>
                </>
           }>
               {this.state.listInfo &&
               <this.state.InputBase
                    fullScreen={this.props.mediaQueryMatches}
                    hideHeader={true}
                    readOnly={true}
                    listInfo={this.state.listInfo}
                    code={this.state.code}
                    title={this.state.listInfo.title}
                    rowsPerPage ={1000000}
                    defaultData={this.state.defaultData}
                    defaultCondition={this.state.defaultCondition}
                    defaultOptionsCode="default_list_options" 
                    optionsFormCode={`${this.state.listInfo.code.toLowerCase()}_options`}
                    ref={ref=>this._list = ref}
                    {...this.props}
                    renderItems={({rows})=>{
                        return (  
                            <div style={{padding:5}}>
                                {rows.length!==0 && <Grid container spacing={1}>
                                    {rows.map(row=>{
                                        const bg2 = gradientBackgroundStyle(row.color||this.context.config.secondaryColor,{brightenFirst:0,brightenSecond:35})
                                        let style={...bg2,height:"100%",position:'relative'}
                                        return (
                                            <Grid key={row._id} item xs={6} sm={6} md={2} lg={2}>
                                                <Card style={style}>
                                                    <CardActionArea onClick={()=>{
                                                        this.props.history.push("/experience-journey/setup/" + row._id)
                                                    }}>
                                                        <CardContent style={{padding:15}}>
                                                            <Typography variant="body2" component="div" style={{color:bg2.color,fontSize:16,fontWeight:500,textAlign:"center"}}>{row.title}</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <IconButton style={{position:"absolute",bottom:2,right:2}} size="small" onClick={()=>{
                                                        this._list.quickEdit(row)
                                                    }}>
                                                        <EditIcon style={{fontSize:18,color:bg2.color}}/>
                                                    </IconButton>
                                                </Card>
                                            </Grid>
                                        )
                                    })}
                                    
                                </Grid>}
                                {rows.length===0 &&
                                    <Button variant="contained" color="secondary" onClick={()=>{
                                        this._list.quickAdd({})
                                    }}>
                                        {this.context.apis.getLabel("+ Hành trình trải nghiệm mới")}
                                    </Button>
                                }
                            </div> 
                        )
                    }}
                />}
            </Frag>
       )
    }
}
Dashboard.contextType =AuthContext;
Dashboard.propTypes={
    match: PropTypes.any,
    history: PropTypes.any,
    location: PropTypes.any,
    mediaQueryMatches: PropTypes.bool,
}
export default Dashboard