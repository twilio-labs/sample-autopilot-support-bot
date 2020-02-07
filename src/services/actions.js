'use strict';

const actions = {
  /**
   * Generates the actions for the operator task
   * @param {string} companyName
   * @return {*}
   */
  greeting: function(companyName) {
    const message = `Thanks for reaching out to ${companyName}`;
    return {
      actions: [
        {
          say: `${message}. What can we help you with?`,
        },
        {
          redirect: 'task://main-menu',
        },
      ],
    };
  },

  /**
   * Gets the main menu action
   * @param {string} baseUrl
   * @return {*}
   */
  mainMenu: function(baseUrl) {
    return {
      actions: [
        {
          say: `You can reply with "reset my password", "check on the status of my delivery”, or "I'm looking for additional information."`,
        },
        {
          listen: {
            tasks: [
              'reset-password',
              'check-delivery',
              'additional-information',
            ],
          },
        },
      ],
    };
  },

  /**
   * Gets the reset password action
   *
   * @param {string} phoneNumber
   * @return {*}
   */
  resetPassword: function(phoneNumber) {
    return {
      actions: [
        {
          say: `We’ve reset the password for the account attached to the number ${phoneNumber}. What would you like to do?`,
        },
        {
          redirect: 'task://main-menu',
        },
      ],
    };
  },

  /**
   * Gets the check on delivery action
   *
   * @return {*}
   */
  checkDelivery: function() {
    return {
      actions: [
        {
          say:
            'Your delivery is scheduled for later this evening. You should expect your package to arrive by the end of the day. What would you like to do?',
        },
        {
          redirect: 'task://main-menu',
        },
      ],
    };
  },

  /**
   * Gets the additional information action
   *
   * @param {*} weekdayHours
   * @param {*} weekendHours
   * @return {*}
   */
  additionalInformation: function(weekdayHours, weekendHours) {
    return {
      actions: [
        {
          say: `Our office hours are from ${weekdayHours.start} to ${weekdayHours.end} Monday - Friday, and from ${weekendHours.start} to ${weekendHours.end} on Saturday and Sunday. What would you like to do?`,
        },
        {
          redirect: 'task://main-menu',
        },
      ],
    };
  },

  /**
   * Gets the operator task
   *
   * @param {string} url
   * @return {*}
   */
  operator: function(url) {
    return {
      actions: [
        {
          say: 'Apologies, I’m not sure how to answer that question.',
        },
        {
          redirect: url,
        },
      ],
    };
  },
};

module.exports = actions;
