CREATE DATABASE IF NOT EXISTS eLead_development;

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
    isPrimary BOOLEAN,
    
    FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE    
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
    exteriorColor VARCHAR(25),

    FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SalesTeams (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    firstName VARCHAR(40),
    lastName VARCHAR(40),
    isPrimary BOOLEAN,
    isPositionPrimary BOOLEAN,
    positionName VARCHAR(40),
    positionCode VARCHAR(40),

    FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Opportunity_SoughtVehicles (
  opportunityId VARCHAR(36) NOT NULL,
  soughtVehicleId VARCHAR(36) NOT NULL,

  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE
  FOREIGN KEY(soughtVehicleId)
      REFERENCES SoughtVehicles(id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Opportunity_TradeIns (
  opportunityId VARCHAR(36) NOT NULL,
  tradeInId VARCHAR(36) NOT NULL,

  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE
  FOREIGN KEY(tradeInIdId)
      REFERENCES TradeIns(id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Opportunity_SalesTeams (
  opportunityId VARCHAR(36) NOT NULL,
  salesTeamsId VARCHAR(36) NOT NULL,

  FOREIGN KEY(opportunityId)
      REFERENCES Opportunities(id)  ON DELETE CASCADE
  FOREIGN KEY(salesTeamsId)
      REFERENCES SalesTeams(id)  ON DELETE CASCADE
);

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