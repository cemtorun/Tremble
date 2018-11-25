import { Component, OnInit, Inject } from '@angular/core';
import { NgModule }         from '@angular/core';
import {DataPopulationService} from '../services/data-population.service';
import * as chart from 'chart.js';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {ResultsPopupComponent} from './results-popup/results-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
	selector: 'app-test-page',
	templateUrl: './test-page.component.html',
	styleUrls: ['./test-page.component.css']
})


export class TestPageComponent implements OnInit {

	public loaded : boolean = false;
	private interval;

	private myLineChart: chart.Chart;

	private timerCount = 15;


	constructor(private dataService:DataPopulationService, private dialog: MatDialog) {
		this.loaded = false;
		this.dataService = dataService;
	}

	ngOnInit() {
		this.loaded = true;

		setTimeout(() => {
			let ctx = document.getElementById('canvas');
			ctx.setAttribute('style', 'height:500px');
			this.myLineChart = new chart.Chart(ctx, {
				type: 'line',
	  			data: {
	  				labels: [],
	  				datasets: [
	  				{
		                label: "Aggregate movement in all directions",
		                data: [],
		                borderColor: '#DC143C',
		                fill: false,
		            }]
	  			},
	  			options: {
	  				responsive: true,
	  				maintainAspectRatio: false,
	  				title: {
	  					display: true,
	  					text: 'Tremor Frequencies'
	  				},
	  				scales: {
	  					yAxes: [{
	  						ticks: {
	  							min: -100,
	  							max: 150,
	  							stepSize: 25
	  						}
	  					}]
	  				}
	  			}
			});
			(<any>window).myLine = this.myLineChart;
		}, 1000)
	}

	pauseTimer() {
	  	clearInterval(this.interval);
	}

	startTimer() {
	  	this.interval = setInterval(() => {
	  		if(this.timerCount > 0) {
	  			this.timerCount--;
	  			this.dataService.getFrequencyData().subscribe((data) => {
	  				let frequency = data['frequency'];
	  				console.log(frequency);
	  				let timestamp = data['timestamp'];
	  				let ctx = document.getElementById('canvas');
	  				var date = new Date(timestamp*1000);
					// Hours part from the timestamp
					var hours = date.getHours();
					// Minutes part from the timestamp
					var minutes = "0" + date.getMinutes();
					// Seconds part from the timestamp
					var seconds = "0" + date.getSeconds();

					// Will display time in 10:30:23 format
					var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	  				this.myLineChart.data.labels.push(formattedTime);
	  				this.myLineChart.data.datasets.forEach((dataset) => {
	  					dataset.data.push(frequency);
	  				});
	  				this.myLineChart.update();
	  			});
	  		} else if(this.timerCount == 0) {
	  			console.log("done");
	  			this.openDialog();
	  			this.timerCount = -1;
	  		}
	  	},1000);
	}

	openDialog() {
		this.dataService.getResultData().subscribe((data2) => {
			let result = Math.round(data2['result'] * 100) / 100;
			const dialogRef = this.dialog.open(ResultsPopupComponent, {
		      width: '800px',
		      data: {'value': result}
		    });
		})
	}
}