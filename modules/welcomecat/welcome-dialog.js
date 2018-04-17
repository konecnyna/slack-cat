'use strict';

module.exports = class WelcomeDialog {
  
  constructor(context, model) {
    this.context = context;    
  }

  onDialogSubmit(body) {  
    console.log(body);
      // const msg = await this.welcomeHelper.setMessage(
      //     this,
      //     data,
      //     data.channel
      // );

      // this.bot.postMessageWithParams(
      //   data.channel,
      //   `Set channel welcome message to: ""`, 
      //   botParams
      // );
  }

  createRoutes(app) {
    app.get('/welcome-cat', (req, res) =>  {
      res.json({test: true});
    });
    app.post('/welcome-cat', (req, res) => {
      const { token, text, trigger_id } = req.body;
      this.context.showDialog(
        {
          title: 'Channel welcome message!',
          callback_id: 'submit-welcome-message',
          submit_label: 'Create',
          elements: [            
            {
              label: 'Message',
              type: 'textarea',
              name: 'message',              
            },
            {
              label: 'Enabled',
              type: 'select',
              name: 'enabled',
              options: [
                {
                  label: 'true',
                  value: 'true',
                },
                {
                  label: 'false',
                  value: 'false',
                },
              ],
            },
          ],
        },
        req.body,
        res
      );
    });
  }
}