import React,{Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import {titleColor,iconColor,mainTextColor} from '../../../config'
import Container,{Icon} from './Container'
import AuthContext from "flexbiz-core/components/auth/Context";
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Frag from "flexbiz-core/components/Frag";
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
import PropTypes from 'prop-types';
class Module extends React.Component{
  constructor(props){
    super(props);
    this.state={}
  }
  async componentDidMount( ) {
  }
  render(){
    let height = this.props.mediaQueryMatches?null:"calc(100vh - 65px - 55px)";
    let module_name = this.props.match.params.module;
    return (
        <>
            <div elevation={0} style={{paddingLeft:10,paddingTop:10,paddingRight:10}}>
                <Breadcrumbs info={{title:module_name}}/>
            </div>
            <AuthContext.Consumer>
                {({menu})=>{
                    if(!menu || menu.length===0) return null;
                    const _menu = menu.filter(m=>m.visible!==false && m.view && (!module_name || module_name===m.group || module_name===m.name_mother_module));
                    const groups = [...new Set(_menu.map(item=>item.group))]
                    return (
                        <Grid container spacing={0} style={{margin:0,padding:0,height:height,overflow:"hidden"}}>
                            <Grid item md={12} lg={12} style={{height:"100%",overflow:"auto"}}>
                              {groups.map(group=>{
                                  const items = _menu.filter(item=>item.group===group);
                                  return (
                                    <Frag key={`section-${group}`} title={group}>
                                      <Grid container  spacing={1}>
                                        {items.map((item,index) => (
                                            <Grid item xs={6} sm={6} md={3} lg={3}  key={index.toString()}>
                                              <Card>
                                                  <CardActionArea component={Link} to={`/m/${module_name}${item.path}`}>
                                                    <CardContent style={{height:100,padding:0}}>
                                                        <div style={{height:"100%",display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                                            <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:10}}>
                                                              <Icon item={item} style={{backgroundColor:iconColor,color:mainTextColor}}/>
                                                            </div>
                                                            <div style={{flexGrow:1,padding:10}}>
                                                              <Typography variant="body2" style={{color:titleColor}}>{this.context.apis.getLabel(item.title).toUpperCase()}</Typography>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                  </CardActionArea>
                                              </Card>
                                            </Grid>
                                        ))}
                                      </Grid>
                                    </Frag>
                                  )
                                })
                              }     
                            </Grid>
                        </Grid>
                    )
                }}
            </AuthContext.Consumer>
        </>
    )
  }
}
Module.contextType = AuthContext;
Module.propTypes={
  mediaQueryMatches: PropTypes.bool,
  history:PropTypes.any,
  match:PropTypes.any,
}

class ModulePage extends Component{
  render(){
    return (
      <Container {...this.props} showDrawerIfIsDesktop={false}>
        <Module {...this.props} />
      </Container>
    )
  }
}

export default  withRouter(withMediaQuery('(max-width:480px)')(ModulePage));
