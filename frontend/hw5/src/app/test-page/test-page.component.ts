import { Component, OnInit } from '@angular/core';
import { NgModule }         from '@angular/core';
import {DataPopulationService} from '../services/data-population.service';
import * as chart from 'chart.js';


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


	constructor(private dataService:DataPopulationService) {
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
	  				this.myLineChart.data.labels.push(timestamp);
	  				this.myLineChart.data.datasets.forEach((dataset) => {
	  					dataset.data.push(frequency);
	  				});
	  				this.myLineChart.update();
	  			});
	  		} else {
	  			console.log("done");
	  		}
	  	},1000);
	}
}