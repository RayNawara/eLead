CREATE DATABASE IF NOT EXISTS eLead_Test;

CREATE TABLE IF NOT EXISTS Opportunities (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    dateIn DATETIME,
    source VARCHAR(40),
    subSource VARCHAR(40),
    status VARCHAR(40),
    subStatus VARCHAR(40),
    uptype  VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS Customers (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    isBusiness boolean,
    businessName VARCHAR(40),
    businessContact VARCHAR(40),
    title VARCHAR(15),
    firstName VARCHAR(50),
    middleName VARCHAR(50),
    lastName VARCHAR(50),
    nickName VARCHAR(50),
    birthday VARCHAR(10),
    addressLine1 VARCHAR(75),
    addressLine2 VARCHAR(75),
    city VARCHAR(50),
    state VARCHAR(15),
    zip VARCHAR(15),
    country VARCHAR(30),
	county VARCHAR(30),
	doNotMail boolean,
	isPreferred boolean
);

CREATE TABLE IF NOT EXISTS Phones (
    customer_id VARCHAR(36) NOT NULL REFERENCES Customers(id),
	number VARCHAR(15),
	phoneType VARCHAR(15),
	preferredTimeToContact VARCHAR(15),
	doNotCall boolean,
	doNotText boolean,
	preferCall boolean,
	preferText boolean
);

CREATE TABLE IF NOT EXISTS Emails (
    customer_id VARCHAR(36) NOT NULL REFERENCES Customers(id),
	address VARCHAR(255),
	emailType VARCHAR(15),
	doNotEmail boolean,
	isPreferred boolean
);

CREATE TABLE IF NOT EXISTS SoughtVehicles (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    isNew BOOLEAN,
    yearFrom YEAR,
    yearTo YEAR,
    make VARCHAR(40),
    model VARCHAR(40),
    carTrim VARCHAR(40),
    vin VARCHAR(17),
    priceFrom INT,
    priceTo INT,
    maxMileage INT,
    stockNumber VARCHAR(17),
    isPrimary BOOLEAN
);

CREATE TABLE IF NOT EXISTS TradeIns (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    carYear YEAR,
    make VARCHAR(40),
    model VARCHAR(40),
    carTrim VARCHAR(40),
    vin VARCHAR(17),
    estimatedMileage INT,
    interiorColor VARCHAR(25),
    exteriorColor VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS SalesTeams (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    firstName VARCHAR(40),
    lastName VARCHAR(40),
    isPrimary BOOLEAN,
    isPositionPrimary BOOLEAN,
    positionName VARCHAR(40),
    positionCode VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS Opportunity_SoughtVehicles (
  opportunityId VARCHAR(36) NOT NULL,
  soughtVehicleId VARCHAR(36) NOT NULL,
  PRIMARY KEY(opportunityId, soughtVehicleId),
  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(soughtVehicleId)
      REFERENCES SoughtVehicles(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Opportunity_TradeIns (
  opportunityId VARCHAR(36) NOT NULL,
  tradeInId VARCHAR(36) NOT NULL,
  PRIMARY KEY(opportunityId, tradeInId),
  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(tradeInId)
      REFERENCES TradeIns(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Opportunity_SalesTeams (
  opportunityId VARCHAR(36) NOT NULL,
  salesTeamsId VARCHAR(36) NOT NULL,
  PRIMARY KEY(opportunityId, salesTeamsId),
  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE,
  FOREIGN KEY(salesTeamsId)
      REFERENCES SalesTeams(id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Activities (
  activityType VARCHAR(50),
  category VARCHAR(50),
  name VARCHAR(50),
  completedDate DATETIME,
  dueDate DATETIME,
  closedDate DATETIME,
  outcome VARCHAR(50),
  createdBy VARCHAR(50),
  assignedTo VARCHAR(50),
  completedBy VARCHAR(50),
  opportunityId VARCHAR(36) NOT NULL,
  uptype  VARCHAR(40),
  source VARCHAR(40),
  subSource VARCHAR(40),
  createdByUserId VARCHAR(36),
  assignedToUserId VARCHAR(36),
  completedByUserId VARCHAR(36),
  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)
);

CREATE TABLE IF NOT EXISTS Employees (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  isActive BOOLEAN,
  isOff BOOLEAN
);