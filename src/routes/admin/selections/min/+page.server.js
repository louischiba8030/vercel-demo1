import { GrandChildModel } from '$lib/mongodb/models/Selection'

export const load = (async () => {
	const majaresp = await fetch('/api/selections/maja', {
		method: 'GET'
	})
	const maja_respdata = await majaresp.json()

	const midresp = await fetch('/api/selections/mid', {
		method: 'GET'
	})
	const mid_respdata = await midresp.json()

	const minresp = await fetch(`/api/selections/min`, {
		method: 'GET',
	})
	const min_retdata = await minresp.json()

  return {
		majaselections: maja_respdata["majaselections"],
		midselections: mid_respdata["midselections"],
		minselections: min_retdata["minselections"]
  }
}) // satisfies PageServerLoad

export const actions = {
	deletebycsv: async ({ request }) => {
		const data = await request.formData()
		console.log("data: ", data)
		const lowerlimit = data.get('lowerlimit') ?? ''
		const upperlimit = data.get('upperlimit') ?? ''
		const csv = data.get('target')

		return

	},
	addbycsv: async ({ request }) => {
		const data = await request.formData()
		const csv = data.get('target')

		console.log("csv.type: ", csv.type)
		let csvArray = new Uint8Array(await csv.arrayBuffer())
		const str = new TextDecoder().decode(csvArray)
		const lines = str.split('\r\n')
		let tmp_arr = []
		const csv_rows = lines.filter(i => {
			const csv_row = i.split(',')
			if (Number(csv_row[0]) >= 1){
				tmp_arr.push({ itemId: Number(csv_row[0]), parentId: csv_row[1], text: csv_row[2] })
				return true
			}
		})

		const addmany_resp = await GrandChildModel.insertMany(tmp_arr)
		console.log("addmany_resp", addmany_resp)

		return
	},
	addminselpost: async ({ request	}) => {
		const data = await request.formData()
		const itemId = data.get('itemId')
		const text = data.get('text')?.toString() ?? ''
		const parentId_id = data.get('parentId_id')

		const add_minresp = await fetch('/api/selections/min', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemId: itemId,
				parentId: parentId_id,
				text: text
			})
		})

		return { added: await add_minresp.json() } // add_majadata.inserted.itemId
	},
	editminselpost: async ({ request }) => {
		const data = await request.formData()
		console.log("minsel data: ", data)

		return
	},
	addnewmid: async ({ request }) => {
		const data = await request.formData()
		console.log("add new maja data: ", data)

		const mid_name = data.get('mid_name')?.toString() ?? ''
		// const parentId = data.get('parentId')

		// Get total maja items:
		const mid_resp =  await fetch('/api/selections/mid', {
			method: 'GET'
		})
		const mid_respdata = await mid_resp.json()
		const total_length = mid_respdata["midselections"].length

		const add_midresp = await fetch('/api/selections/mid', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemId: total_length + 1,
				text: mid_name
			})
		})

		const add_majadata = await add_midresp.json()

		return { added: add_majadata } // add_majadata.inserted.itemId
	},
	addnewmaja: async ({ request }) => {
		const data = await request.formData()
		console.log("add new maja data: ", data)

		const maja_name = data.get('maja_name')?.toString() ?? ''

		// Get total maja items:
		const maja_resp =  await fetch('/api/selections/maja', {
			method: 'GET'
		})
		const maja_respdata = await maja_resp.json()
		const total_length = maja_respdata["majaselections"].length

		const add_majaresp = await fetch('/api/selections/maja', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemId: total_length + 1,
				text: maja_name
			})
		})

		const add_majadata = await add_majaresp.json()

		return { added: add_majadata } // add_majadata.inserted.itemId
	}
} // satisfies Actions