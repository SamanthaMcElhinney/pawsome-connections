///<reference types="Cypress" />

describe("Dashboard", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://api.petfinder.com/v2/animals?age=senior", {
      fixture: "animalsData.json",
    }).visit("http://localhost:3000/");
  });
  it("should have a header with an image of the logo and title of website", () => {
    cy.get("header").should("is.visible").find("img").should("be.visible");
  });
  it("should display a button to take the user back home ", () => {
    cy.get(".show-favorites-btn ").should("have.text", "Show Favorite Pets");
  });
  it("should see a navigation section with the option to select by pet type, filter by zipcode, and submit the search", () => {
    cy.get("form")
      .get("select")
      .first()
      .contains("All Pets")
      .get("select")
      .last()
      .contains("Cat")
      .get("input")
      .first()
      .should("have.attr", "placeholder", "Input Zip Code")
      .get('input[type="submit"]')
      .should("be.visible");
  });
  it("should have a list of cards with animals to adopt", () => {
    cy.get(".animals-container").find(".animal-card ").should("have.length", 4);
    cy.get(".animals-container > :nth-child(1)").contains("Sadie");
    cy.get(".animals-container > :nth-child(2)").contains("Gambit");
    cy.get(".animals-container > :nth-child(3)").contains("Dexter");
  });
  it("should allow a user to click on an animal card and navigate to the animals detail page", () => {
    cy.get(".animal-card").first().click();
    cy.url().should("include", "/animal/64841660");
  });
});
it("should see a error in the case of a bad GET response", () => {
  cy.intercept("https://api.petfinder.com/v2/animals?age=senior", {
    statusCode: 404,
  }).visit("http://localhost:3000");
  cy.get(".header-section").get("h1").should("have.text", "Failed to Fetch");
});
describe("Search Form", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://api.petfinder.com/v2/animals?age=senior", {
      fixture: "animalsData.json",
    });
    cy.intercept(
      "GET",
      "https://api.petfinder.com/v2/animals?age=senior&location=31601",
      {
        fixture: "animalsData.json",
      }
    );
    cy.visit("http://localhost:3000/");
  });

  it("should be able to input data in a form to search by zipcode", () => {
    cy.get("form")
      .get('input[name="location"]')
      .type("31601")
      .get('input[type="submit"]')
      .click();
    cy.get(".animal-card")
      .first()
      .should("have.text", "🤍SadieSenior | Shih Tzu | Valdosta, GA");
  });

  it("should give an error message if there are no matching zip codes", () => {
    cy.get("form")
      .get('input[name="location"]')
      .type("34")
      .get('input[type="submit"]')
      .click();
    cy.get(".zipcode-error").should(
      "have.text",
      "Zip code should be 5 characters long."
    );
  });

  it("should search for pets by type", () => {
     cy.intercept(
       "GET",
       "https://api.petfinder.com/v2/animals?age=senior&type=dog",
       {
         fixture: "animalsData.json",
       }
     ).as("searchByType")
     .visit("http://localhost:3000");
    const selectedType = "dog";
    cy.get("#animalTypeSelected").select(selectedType);
    cy.get("form").submit();
 cy.wait("@searchByType").then(() => {
   cy.get(".animals-container").should("be.visible");
   cy.get(".animal-card").should("have.length", 3);
 });
  });
});
