/*eslint-disable*/ 
import React, { Component } from "react";
import "../dashboard.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import WidgetText from "./WidgetText";
import WidgetBar from "./WidgetBar";
import WidgetColumn from "./WidgetColumn";
import WidgetDoughnut from "./WidgetDoughnut";
import { Col, Row, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const config = {
	apiKey: "AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI",
	spreadsheetId: "1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg",
};

const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			items: [],
			dropdownOptions: [],
			selectedValue: null,
			organicSource: null,
			directSource: null,
			referralSource: null,
			socialSource: null,
			pageView: null,
			users: null,
			newUsers: null,
			sourceArr: [],
			usersArr: [],
			sessions: null,
			sessionAtt: [],
			bounceRate: null,
		};
	}

	getData = (arg) => {
		const arr = this.state.items;
		const arrLen = arr.length;

		let organic_Source = 0;
		let direct_Source = 0;
		let selectedValue = null;
		let referral_Source = 0;
		let social_Source = 0;
		let page_Views = 0;
		let users = 0;
		let new_Users = 0;
		let source_Arr = [];
		let users_Arr = [];
		let sessions = 0;
		let session_Att = [];
		let bounce_Rate = 0;

		for (let i = 0; i < arrLen; i++) {
			if (arg === arr[i]["month"]) {
				organic_Source = arr[i].organic_source;
				direct_Source = arr[i].direct_source;
				referral_Source = arr[i].referral_source;
				page_Views = arr[i].page_views;
				users = arr[i].users;
				new_Users = arr[i].new_users;
				social_Source = arr[i].social_source;
				sessions = arr[i].sessions;
				bounce_Rate = arr[i].bounce_rate;
				source_Arr.push(
					{
						label: "Organic Source",
						value: arr[i].organic_source,
					},
					{
						label: "Direct Source",
						value: arr[i].direct_source,
					},
					{
						label: "Referral Source",
						value: arr[i].referral_source,
					},
					{
						label: "Social Source",
						value: arr[i].social_source,
					}
				);
				users_Arr.push(
					{
						label: "Users",
						value: arr[i].users,
					},
					{
						label: "New Users",
						value: arr[i].direct_source,
					}
				);

				session_Att.push(
					{
						label: "Sessions per Users",
						value: arr[i].number_of_sessions_per_users,
					},
					{
						label: "Page per session",
						value: arr[i].page_per_session,
					},
					{
						label: "Average Session Time",
						value: arr[i].avg_session_time,
					}
				);
			}
		}
		selectedValue = arg;
		this.setState(
			{
				organicSource: organic_Source,
				directSource: direct_Source,
				referralSource: referral_Source,
				pageViews: page_Views,
				users: users,
				newUsers: new_Users,
				socialSource: social_Source,
				sourceArr: source_Arr,
				usersArr: users_Arr,
				sessions: sessions,
				sessionAtt: session_Att,
				bounceRate: bounce_Rate,
			},
			() => console.log(this.state.sourceArr)
		);
	};
	updateDashboard = (event) => {
		this.getData(event.value);
		this.setState({ selectedValue: event.value }, () =>
			console.log(this.state.organicSource)
		);
	};

	componentDidMount() {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				let batchRowValues = data.valueRanges[0].values;

				const rows = [];

				for (let i = 1; i < batchRowValues.length; i++) {
					let rowObject = {};
					for (let j = 0; j < batchRowValues[i].length; j++) {
						rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
					}
					rows.push(rowObject);
				}

				let dropdownOptions = [];

				for (let i = 0; i < rows.length; i++) {
					dropdownOptions.push(rows[i].month);
				}

				dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
				this.setState(
					{
						items: rows,
						dropdownOptions: dropdownOptions,
						selectedValue: "Jan 2018",
					},
					() => this.getData("Jan 2018")
				);
			});
	}

	render() {
		return (
			<div>
				<Container fluid className="mainDashboard">
					<Row className="TopHeader">
						<Col>Dashboard</Col>
						<Col>
							<Dropdown
								options={this.state.dropdownOptions}
								onChange={this.updateDashboard}
								value={this.state.selectedValue}
								placeholder="Select an option"
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<WidgetText title="Organic Source" value={this.state.organicSource} />
						</Col>
						<Col>
							<WidgetText title="Direct Source" value={this.state.directSource} />
						</Col>
						<Col>
							<WidgetText title="Referral Source" value={this.state.referralSource} />
						</Col>
						<Col>
							<WidgetText title="Social Source" value={this.state.socialSource} />
						</Col>
					</Row>
					<Row>
						<Col>
							<WidgetText title="Users" value={this.state.users} />
						</Col>
						<Col>
							<WidgetText title="Referral Source" value={this.state.newUsers} />
						</Col>
						<Col>
							<WidgetText title="Sessions" value={this.state.sessions} />
						</Col>
						<Col>
							<WidgetBar title="Source Comparison" data={this.state.sourceArr} />
						</Col>
					</Row>
					<Row>
						<Col>
							<WidgetDoughnut title="Users Comparison" data={this.state.usersArr} />
						</Col>
						<Col>
							<WidgetText title="Bounce Rate" value={this.state.bounceRate} />
						</Col>
						<Col>
							<WidgetColumn title="Session Attributes" data={this.state.sessionAtt} />
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Dashboard;
