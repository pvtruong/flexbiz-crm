import React from 'react';
import dagreD3 from 'dagre-d3';
import Button from '@material-ui/core/Button';
import  * as d3  from "d3";
import Container from '../Container';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import AuthContext from "flexbiz-core/components/auth/Context";
import InputBase from "flexbiz-core/components/InputBase";
import tinycolor2 from "tinycolor2";

import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import queryString from 'query-string';
import Breadcrumbs from "flexbiz-core/components/Breadcrumbs";
class CTDNDiagram extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            load:0,
            objs:null
        }
        this.addNode = this.addNode.bind(this);
        this.viewBP = this.viewBP.bind(this);
        window.addNode = this.addNode;
        window.viewBP = this.viewBP;
    }
    componentDidMount(){
        this.loadDmbp();
    }
    viewBP(_id){
        this.props.history.push(`/view/dmbp/${_id}`);
    }
    async loadDmbp(){
        const condition ={}
        this.context.setProgressStatus(true);
        try{
            const objs = await this.context.apis.asyncGetList(this.context.userInfo.token,"dmbp",{condition:condition,limit:100000});
            this.setState({objs,load:this.state.load+1},()=>{
                this.renderSvg()
            })
            this.context.setProgressStatus(false);
        }catch(e){
            this.context.alert(e.message);
        }
    }
    renderSvg(){
        let g = new dagreD3.graphlib.Graph({compound:false})
        .setGraph({})
        .setDefaultEdgeLabel(function() { return {}; });
        //set nodes
        this.state.objs.forEach(obj => {
            let maincolor = obj.color || this.context.config.secondaryColor;
            let color1 = tinycolor2(maincolor).brighten(35).toString();
            let color2 = tinycolor2(maincolor).brighten(50).toString();
            let color = (tinycolor2(color1).isLight()?"black":"white");
            let background = `linear-gradient(${color1},${color2})`;
            let label = `
                <div style="background-image:${background};color:${color};padding:5px;border-radius:5px">
                    <div  onClick="viewBP('${obj._id}')">
                        <div style="font-weight:500;font-size:18px">${obj.ten_bp}</div>
            
                    </div>
                    <div  style="margin-top:10px;padding-top:10px;border-top:1px solid #ddd;display:flex;justify-content:space-between;align-items:"center">
                        <input type="button" onClick="addNode('${obj.ma_bp}','${obj.phu_trach}','${(obj.attends||[]).join(",")}')" value="Thêm nhánh"/>
                    </div>
                </div>
            `
            g.setNode(obj.ma_bp,{label:label,labelType:"html"});
        });
        //set edges
        this.state.objs.forEach(obj => {
            if(obj.ma_bp_me){
                g.setEdge(obj.ma_bp_me,obj.ma_bp);
            }
        });
        // Round the corners of the nodes
        g.nodes().forEach(function(v) {
            let node = g.node(v);
            node.rx = node.ry = 5;
          });
        // Set up an SVG group so that we can translate the final graph.
        let svg = d3.select(this.nodeTree);
        let inner = svg.select("g");
        //setup zoom
        let zoom = d3.zoom().on("zoom", function(e) {
            inner.attr("transform", e.transform);
        });
        svg.call(zoom);
        // Create the renderer
        let render = new dagreD3.render();
        // Run the renderer. This is what draws the final graph.
        render(inner, g);
        svg.attr("height", g.graph().height + 4);
        svg.attr("width", g.graph().width + 4);
        // Center the graph
        let xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
        inner.attr("transform", "translate(" + xCenterOffset + ", 2)");
    }
    addNode(ma_bp,phu_trach,attends=""){
        this._dmbp.quickAdd({ma_bp_me:ma_bp,phu_trach,attends:attends.split(",")},async (rs)=>{
            const {objs} = this.state;
            objs.push(rs);
            this.setState({objs,load:this.state.load+1},()=>{
                this.renderSvg()
            })
        })
    }
    render(){
        return (
            <>
                {this.props.title && <Typography style={{textAlign:"center",marginTop:10}} component="h4" variant="h4">{this.props.title}</Typography>}
                {this.state.objs && this.state.objs.length===0 &&
                    <div style={{display:"flex",justifyContent:"center",padding:20}}>
                        <Button variant="outlined" style={{padding:25}} color="secondary" onClick={()=>this.addNode()}>{this.context.apis.getLabel("Thêm bộ phận")}</Button>
                    </div>
                }
                <div style={{display:"flex",justifyContent:"center",marginTop:10}}>
                    <svg id="svg-container" ref={ref=>this.nodeTree= ref}><g/></svg>
                </div>
                <InputBase
                    noRender={true}
                    code={"dmbp"}
                    rowsPerPage ={1000000}
                    ref={ref=>this._dmbp = ref}
                />
            </>
        )
    }
}
CTDNDiagram.contextType = AuthContext;
CTDNDiagram.propTypes={
    title:PropTypes.string,
    history:PropTypes.any,
}

class ListPage extends React.PureComponent{
    constructor(props){
        super(props);
        const query = queryString.parse(this.props.location.search);
        this.title = query.title;
    }
    render(){
      let paths = [
        {to:`/module/Nhân%20sự%20(HRM)`,title:"Cấu trúc doanh nghiệp"}
      ]
      if(this.title){
        paths.push({
          title:this.title
        })
      }
      return (
        <Container requireLogin {...this.props}  showDrawerIfIsDesktop={false}>
          <div elevation={0} style={{padding:10}}>
              <Breadcrumbs info={{paths:paths}}/>
          </div>
          <CTDNDiagram {...this.props} title ={this.title} />
        </Container>
      )
    }
  }
ListPage.propTypes={
    match: PropTypes.any,
    history: PropTypes.any,
    location: PropTypes.any,
    mediaQueryMatches: PropTypes.bool,
}

export default  withRouter(withMediaQuery('(max-width:480px)')(ListPage));