'use strict';
const WelcomeHelper = require('./welcome-helper.js');

module.exports = class WelcomeDialog {
  
  constructor(context, welcomeHelper) {
    this.context = context;    
    this.welcomeHelper = welcomeHelper;
  }

  async onDialogSubmit(body) {  
    const enabled = (body.submission.enabled === 'true');
    const genericWelcome = body.submission.welcome_select === 'true';
    this.welcomeHelper.setMessage(body.submission.message, enabled, body.channel.id, genericWelcome);
  }

  createRoutes(app, dialogId) {        
    app.post('/welcome-cat', async (req, res) => {
      const { token, text, trigger_id, channel_id, channel_name } = req.body;      
      let welcomeObject =  await this.welcomeHelper.getOptionsForChannel(channel_id);          
      

      this.context.showDialog(
        {
          title: `Channel Welcome Message`,
          callback_id: dialogId,
          submit_label: "Submit",
          elements: [            
            {
              label: `Message`,
              type: 'textarea',
              name: 'message', 
              value: welcomeObject ? welcomeObject.get('message') : ""             
            },
            {
              label: 'Enabled',
              type: 'select',
              value: (welcomeObject && welcomeObject.get('enabled')) ? "true" : "false",
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
            {
              label: 'Post to channel on join',
              type: 'select',
              value: (welcomeObject && welcomeObject.get('generic_welcome')) ? "true" : "false",
              name: 'welcome_select',
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