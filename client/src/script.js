String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
Date.prototype.goToNewDay = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  return newDate;
};
Date.prototype.goToEndDay = function () {
  const newDate = new Date(this);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setHours(23);
  return newDate;
};
Date.prototype.goToNewWeek = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day;
  return newDate.setDate(diff);
};

Date.prototype.goToEndWeek = function () {
  const newDate = new Date(this);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setHours(23);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + 6;
  return newDate.setDate(diff);
};

Date.prototype.goToNewMonth = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  newDate.setDate(1);
  return newDate;
};

Date.prototype.goToEndMonth = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  newDate.setDate(1);
  const month = newDate.getMonth();
  newDate.setMonth(month + 1);
  return new Date(newDate.getTime() - 1000);
};

Date.prototype.goToNewYear = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  newDate.setMonth(0);
  newDate.setDate(1);
  return newDate;
};

Date.prototype.goToEndYear = function () {
  const newDate = new Date(this);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setHours(23);
  newDate.setMonth(11);
  newDate.setDate(31);
  return newDate;
};

Date.prototype.goToNewQuarter = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  newDate.setDate(1);
  return newDate;
};

Date.prototype.goToEndQuarter = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setHours(0);
  newDate.setMonth(newDate.getMonth() + 3);
  newDate.setDate(1);
  return new Date(newDate.getTime() - 1000);
};

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [
    this.getFullYear(),
    (mm > 9 ? "-" : "-0") + mm,
    (dd > 9 ? "-" : "-0") + dd,
  ].join("");
};
