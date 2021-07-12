let obj = {
  "id": "6d3c6468-cb25-eb11-8246-005056b1b8c5",
  "customer": {
    "id": "ee0abb41-cb25-eb11-8246-005056b1b8c5",
    "links": [
      {
        "rel": "self",
        "href":
          "https://api.fortellis.io/sales/v1/elead/customers/ee0abb41-cb25-eb11-8246-005056b1b8c5",
        "method": "GET",
        "title": "Fetch Customer"
      },
      {
        "rel": "create",
        "href": "https://api.fortellis.io/sales/v1/elead/customers",
        "method": "POST",
        "title": "Create Customer"
      },
      {
        "rel": "update",
        "href":
          "https://api.fortellis.io/sales/v1/elead/customers/ee0abb41-cb25-eb11-8246-005056b1b8c5",
        "method": "POST",
        "title": "Update Customer"
      }
    ]
  },
  "dateIn": "2020-11-13T16:15:00Z",
  "source": "Tent Event",
  "status": "Active",
  "subStatus": "New",
  "upType": "Internet",
  "soughtVehicles": [
    {
      "id": "6e3c6468-cb25-eb11-8246-005056b1b8c5",
      "isNew": true,
      "priceFrom": 0.0000,
      "priceTo": 0.0000,
      "maxMileage": 0,
      "stockNumber": "",
      "isPrimary": true
    }
  ],
  "tradeIns": [
    {
      "id": "75bdc596-cb25-eb11-8246-005056b1b8c5",
      "year": 2017,
      "make": "Chrysler",
      "model": "300",
      "trim": "S 4dr Rear-wheel Drive Sedan",
      "vin": "2C3CCABG9HH560163",
      "estimatedMileage": 23452,
      "interiorColor": "",
      "exteriorColor": ""
    }
  ],
  "salesTeam": [
    {
      "id": "9a85f1b4-4557-ea11-a98d-005056b15429",
      "firstName": "Joe",
      "lastName": "Alonzo",
      "isPrimary": true,
      "isPositionPrimary": true,
      "positionName": "Support Tech",
      "positionCode": "S",
      "links": []
    }
  ],
  "links": [
    {
      "rel": "create",
      "href": "https://api.fortellis.io/sales/v2/elead/opportunities",
      "method": "POST",
      "title": "Create Opportunity"
    },
    {
      "rel": "self",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/6d3c6468-cb25-eb11-8246-005056b1b8c5",
      "method": "GET",
      "title": "Get Opportunity"
    },
    {
      "rel": "comment",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/comment",
      "method": "POST",
      "title": "Add Comment"
    },
    {
      "rel": "email",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/sendEmail",
      "method": "POST",
      "title": "Send Email"
    },
    {
      "rel": "tradein",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/tradein",
      "method": "POST",
      "title": "Add Trade-In"
    },
    {
      "rel": "vehiclesought",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/vehicleSought",
      "method": "POST",
      "title": "Add Vehicle Sought"
    },
    {
      "rel": "salesperson",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/reassignPrimarySalesperson",
      "method": "POST",
      "title": "Reassign Primary Salesperson"
    },
    {
      "rel": "salesperson",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/6d3c6468-cb25-eb11-8246-005056b1b8c5/salesteam/add",
      "method": "POST",
      "title": "Add Salesperson"
    },
    {
      "rel": "salesperson",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/6d3c6468-cb25-eb11-8246-005056b1b8c5/salesteam/remove",
      "method": "POST",
      "title": "Remove Salesperson"
    },
    {
      "rel": "substatus",
      "href":
        "https://api.fortellis.io/sales/v2/elead/opportunities/6d3c6468-cb25-eb11-8246-005056b1b8c5/subStatus/update",
      "method": "POST",
      "title": "Update SubStatus"
    }
  ]
}

console.log('Opportunity: ', Object.keys(obj));
console.log('Sought Vehicle: ', Object.keys(obj.soughtVehicles[0]));
console.log('SalesTeam: ', Object.keys(obj.salesTeam[0]));