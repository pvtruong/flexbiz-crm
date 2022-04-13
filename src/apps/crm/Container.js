import React from 'react';
import PropTypes from 'prop-types';
import {NavLink,withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ReportIcon from '@material-ui/icons/Assessment';
import VoucherIcon from '@material-ui/icons/PostAdd';
import ListIcon from '@material-ui/icons/PlaylistAdd';
import UserGroupIcon from '@material-ui/icons/PeopleAlt';
import Avatar from '@material-ui/core/Avatar';
import AuthContext from "flexbiz-core/components/auth/Context";
import Container from "flexbiz-core/components/Container";
import {mainTextColor,titleColor,iconColor} from '../../../config'
import Chip from '@material-ui/core/Chip';

export function Icon({item,...others}){
  let dicon = <ArrowForwardIosIcon  style={{color:"white"}}/>;
  if(item){
    if(item.type==="user" || item.path.includes("/usergroup"))  dicon =  <UserGroupIcon style={{color:"white"}}/>;
    if(item.type==="calc" || item.path.includes("/tinh"))  dicon = <ArrowForwardIosIcon  style={{color:"white"}}/>;
    if(item.type==="voucher" || item.path.includes("/voucher"))  dicon = <VoucherIcon  style={{color:"white"}}/>;
    if(item.type==="report" || item.path.includes("/report")) dicon = <ReportIcon  style={{color:"white"}}/>;
    if(item.type==="list" || item.path.includes("/list"))  dicon = <ListIcon  style={{color:"white"}}/>;
  }
  
  return  <Avatar {...others}>{dicon}</Avatar>
}
Icon.propTypes={
  item: PropTypes.object,
  style: PropTypes.object,
}

class VContainer extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
  }
  render(){
    return (
      <Container 
        requireLogin
        {...this.props}
        showCompanyNameOnHeader ={false}
        renderComanyName={appInfo=>{
          return <Chip label={appInfo.short_name || appInfo.name} onClick={()=>{
            this.props.history.push('/system/appinfo')
          }}/>
        }}
        //appLogo={<img src="/images/logo.png" style={{height:48,marginTop:5}}/>}
        linkStyle={{color:mainTextColor}}
        showDrawerIfIsDesktop ={this.props.showDrawerIfIsDesktop}
        drawer={()=>{
          return (
              <List>
                <AuthContext.Consumer>
                  {({menu})=>{
                    if(!menu || menu.length===0) return null;
                    const _menu = menu.filter(m=>m.visible!==false && m.view);
                    const groups = [...new Set(_menu.map(item=>item.group))]
                    return groups.map(group=>{
                        const items = _menu.filter(item=>item.group===group);
                        return (
                          <li key={`section-${group}`}>
                            <ul style={{padding:0}}>
                              <ListSubheader>{this.context.apis.getLabel(group)}</ListSubheader>
                              {items.map((item,index) => (
                                <ListItem button key={index.toString()} component={NavLink} to={item.group==="Home"?item.path:`/m/${item.group}${item.path}`} activeStyle={{color: titleColor}}>
                                  <ListItemIcon>
                                    <Icon item={item} style={{background:iconColor,color:mainTextColor}}/>
                                  </ListItemIcon>
                                  <ListItemText  primary={this.context.apis.getLabel(item.title)} />
                                </ListItem>
                              ))}
                            </ul>
                          </li>
                        )
                      })
                  }}
                </AuthContext.Consumer>
            </List>
        )
      }}
      {...this.props}>
        {this.props.children}
      </Container>
    )
  }
}
VContainer.contextType = AuthContext;
VContainer.propTypes={
  children: PropTypes.any,
  match: PropTypes.any,
  history: PropTypes.any,
  showDrawerIfIsDesktop: PropTypes.bool,
}

export default  withRouter(VContainer);
