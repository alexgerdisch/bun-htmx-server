console.log('Serving at 0.0.0.0:3000');

Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);
        
        if (url.pathname === "/") {
            return new Response("<h2>Home!</h2>");
        }
        if (url.pathname === "/contact/1"){

            let valueObj = {
                firstName: '',
                lastName: '',
                email: ''
            };
            
            // Parse body
            const body = await req.text();
            const values = body.split("&");
            console.log(values);
            values.forEach(value => {
                let subArr = value.split('=');
                valueObj[subArr[0]] = subArr[1];
            });

            valueObj.email = valueObj.email.split('%40').join('@');
            
            
            // Respond with updated HTML
            const putResponse = new Response (`
            <div hx-target="this" hx-swap="outerHTML">
                <div><label>First Name</label>: ${valueObj.firstName}</div>
                <div><label>Last Name</label>: ${valueObj.lastName}</div>
                <div><label>Email</label>: ${valueObj.email}</div>
                <button hx-get="http://0.0.0.0:3000/contact/1/edit" class="btn btn-primary">
                Click To Edit
                </button>
            </div>
            `);
            putResponse.headers.set('Access-Control-Allow-Headers', '*');
            putResponse.headers.set('Access-Control-Allow-Origin', '*');
            putResponse.headers.set('Access-Control-Allow-Methods', '*');
            return putResponse;
        }
        if (url.pathname === "/contact/1/edit") {
            const contactResponse = new Response (`
<form hx-post="http://0.0.0.0:3000/contact/1" hx-target="this" hx-swap="outerHTML" hx-include="#fName, #lName, #eMail">
  <div>
    <label>First Name</label>
    <input type="text" name="firstName" id="fName" value="Bumpy">
  </div>
  <div class="form-group">
    <label>Last Name</label>
    <input type="text" name="lastName" id="lName" value="McJumpy">
  </div>
  <div class="form-group">
    <label>Email Address</label>
    <input type="email" name="email" id="eMail" value="bmcjump@jesslex.com">
  </div>
  <button class="btn">Submit</button>
  <button class="btn" hx-get="/contact/1">Cancel</button>
</form>
`);
            console.log('REQUESTED Contact Edit');
            contactResponse.headers.set('Access-Control-Allow-Headers', '*');
            contactResponse.headers.set('Access-Control-Allow-Origin', '*');
            contactResponse.headers.set('Access-Control-Allow-Methods', '*');
            console.log('CORS headers added');
            return contactResponse;
        }

    }
})