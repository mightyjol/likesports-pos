<template>
	<div>
		<h4>Printers Settings</h4>
		<div v-if='bHasDefault'>
			<div v-for="d in defaultPrinters">
				<el-card v-if="d.name != undefined">
					<div slot="header">
						{{d.type}}
					</div>
					<div>
						{{d.name}}
						<el-button @click="testPrinter(d.name)">
							print test page
						</el-button>
						<el-button type="danger" @click="deletePrinter(d.type)">
							remove
						</el-button>
					</div>
				</el-card>
			</div>
		</div>
		<el-alert title="You need to setup default printers" type="error" v-else>	
		</el-alert>
		<div>
			<el-button @click="lookForPrinters">
				find new printer
			</el-button>
			<div  v-if="printers.length">
				<h5>printers found</h5>
				<el-table striped :data="printers">
					<el-table-column
						label="Name"
						prop="name"
					>
					</el-table-column>
					<el-table-column>
						<template v-slot="scope">
							<el-button @click="setAsA4Default(scope.row.name)">
								set as default printer
							</el-button>
						</template>
					</el-table-column>
					<el-table-column>
						<template  v-slot="scope">
							<el-button @click="setAsTicketDefault(scope.row.name)">
								set as ticket printer
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	
export default {
	created: async function () {
		ipc.send('getPrintersDefault')
		ipc.on('printersDefault', (event, data) => {
			this.defaultPrinters = data;
		});
		ipc.on('printers', (event, data) => {
			this.printers.push(...data);
			this.bIsLookingForPrinter = false
		});
	},
	methods: {
		lookForPrinters: function(){
		 	this.bIsLookingForPrinter = true
		 	this.printers = [];
		 	ipc.send('getPrinters');
		},
		setAsA4Default: function(name){
			ipc.send('setA4Printer',name);
		},
		setAsTicketDefault: function(name){
			ipc.send('setTicketPrinter', name);
		},
		deletePrinter: function(type){
			ipc.send('deletePrinter', type)
		},
		testPrinter: function(name){
			ipc.send('testPrinter', name)
		}
	},
	computed: {
		bHasDefault: function(){
			if(this.defaultPrinters == undefined) return false
			return (this.defaultPrinters.a4.name != undefined || this.defaultPrinters.ticket.name != undefined)
		}
	},
	data: function () {
		return {
			defaultPrinters: undefined,
			printers: [],
			bIsLookingForPrinter: false
		}
	}
}

</script>