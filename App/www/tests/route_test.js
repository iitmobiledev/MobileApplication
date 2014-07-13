 describe('Phone detail view', function() {
 
    beforeEach(function() {
      browser().navigateTo('/index.html');
    });
 
    it('should display placeholder page with phoneId', function() {
      expect(browser().location().url()).toBe('/statistic');
    });
 });

//describe('angularjs homepage', function() {
//  it('should greet the named user', function() {
//    browser.get('http://www.angularjs.org');
//    element(by.model('yourName')).sendKeys('Julie');
//    var greeting = element(by.binding('yourName'));
//    expect(greeting.getText()).toEqual('Hello Julie!');
//  });
//});