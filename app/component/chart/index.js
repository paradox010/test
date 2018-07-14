import React from 'react'
import { Component } from 'react';
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/timeline'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/brush'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
//import 'echarts/lib/chart/bar'
//import 'echarts/lib/chart/gauge'
//import 'echarts/lib/chart/treemap'
//import 'echarts/lib/chart/line'
//import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/graph'
import { message } from 'antd';
// import  '../index.css'

export default class Chart extends Component {

	constructor(props) {
		super(props)
		this.initPie = this.initPie.bind(this)
		this.options =null
	}
	decorateData(origin,output,showEntities){
		//根据显示nodes数，当前选中节点，显示层数待定包装nodes，links，legend
//		{nodes,links,legendData,selectedNode}
//		{entity5bbbb:1,}[entity5bbbb]
		var legends={};
		var legendLists=[];
		const newNodes = [];
		const newNodes_null = origin.nodes.map((node)=>{
			if(node.name===origin.selectedNode.name){
				//选中节点
				node.category='selectedNode';
				return node
			}
			if(legendLists.indexOf(node.category)>-1){
				if(legends[node.category]===showEntities-1){
					return null
				}else{
					legends[node.category]+=1;
				}
			}else{
				legendLists.push(node.category);
				legends[node.category]=0;
			}
			return node
		})
		for(let i=0; i<newNodes_null.length;i++){
			if(newNodes_null[i]){
				newNodes.push(newNodes_null[i])
			}
		}
		output.series[0].nodes  = newNodes;
		origin.legendData.unshift('selectedNode');
		output.series[0].links=origin.links;
		output.legend.data=origin.legendData;
		output.series[0].categories=origin.legendData.map((d)=>{return {name:d}});
	}
	decorateLegendFormatter(legend,nodes){
		var legendForm = {}
		for(let i= 0;i<legend.length;i++){
			var nameC='',id='',nameb='';
			if(legend[i]==='selectedNode'){
				legendForm.selectedNode = '当前选中节点';
			}else{
				if(legend[i].indexOf('concept')>-1){
					nameC='实体';
					id=legend[i].replace(new RegExp('concept'),'')
				}else if(legend[i].indexOf('entity')>-1){
					nameC = '实例';
					id=legend[i].replace(new RegExp('entity'),'')
				}

				for(let j=0;j<nodes.length;j++){
					if(nodes[j].name===id){
						nameb = nodes[j].value;
						j=nodes.length
					}
				}
				legendForm[legend[i]] = nameb+nameC
			}
		}
		return legendForm;
	}
	initPie() {
		const {
			option = {}
		} = this.props //外部传入的data数据
		if(this.props.showName){
			option.title={
			left:'center',
			text:this.props.showName
			}
		}
		// data:{'2017':1,'2018':2}
		//数据的处理
		if(this.props.type==='timeline'||this.props.type==='bar'||this.props.type==='line'){
			
			option.xAxis.data = Object.keys(this.props.data);
			option.series[0].data = Object.values(this.props.data);

		}else if(this.props.type==='graph'){
			//nodes,links,categories
			if(this.props.data){
				this.decorateData(this.props.data,option,this.props.showEntities||30);
				const legendForm = this.decorateLegendFormatter(option.legend.data,this.props.data.nodes)
				option.legend.formatter=function(name){return legendForm[name]}
			}
		}else{
		}
		
		this.options=option;
		const myChart = echarts.getInstanceByDom(this.ID)?echarts.getInstanceByDom(this.ID):echarts.init(this.ID)

		//设置options
//		console.log(option)
		myChart.setOption(option)
		if(this.props.renderBrushed){
			myChart.on('brushSelected', this.props.renderBrushed);
		}
		if(this.props.dblClick){
			myChart.on('dblClick', this.preDblClick);
		}
		// this.props.renderBrushed&&myChart.on('brushSelected', this.props.renderBrushed);
		// this.props.click&&myChart.on('click', this.props.click);
		window.onresize = function () {
			myChart.resize()
		}
	}
	preDblClick=(params)=>{
		//判断节点下是否有子节点 有则只改变当前节点 没有则发送请求获取子节点
//		data:{attrMap,name-id,type-concept,value-name}
		if(params.dataType==='node'&&params.data.name!==this.props.data.selectedNode.name){
			if(this.options.series[0].links.some(link=>link.source===params.data.name)){
				this.props.dblClick(params.data,1)
			}else{
				this.props.dblClick(params.data);
			}
		}else if(params.data.name===this.props.data.selectedNode.name){
			//当前子节点下无数据
			message.warning("当前子节点下无数据")
		}
	}
	componentDidMount() {
		this.initPie();
	}
	shouldComponentUpdate(props){
		// console.log(this.options)
		//props新传递进来？
		if(props.data&&props.data.nodes===this.options.series[0].nodes){
			return false
		}
		return true
	}
	componentWillUnmount() {
		echarts.dispose(this.ID)
  	}
	componentDidUpdate() {
		this.initPie()
	}

	render() {
		const {
			width = "100%", height = "300px"
		} = this.props
		return (
			<div ref = {ID => this.ID = ID}
		style = {{width,height}} id="forceGraph"> < /div>)
	}
}
