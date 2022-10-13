/// <reference types="cypress" />
import * as alrts from "..//fixtures/credentials.json";
import { faker } from "@faker-js/faker";
const randomName = faker.name.firstName();
const randomPwrd = faker.internet.password();
const alrt = alrts[0];

describe("Kata Demoblaze", () => {
  before("Visite site", () => {
    cy.visit("/");
  });
  it("Creer un utilisateur", () => {
    const stub = cy.stub().as("stubs");
    cy.on("window:alert", stub);

    cy.get("#signin2").click();
    cy.wait(1000);
    cy.login(randomName, randomPwrd);

    cy.wait(1000).get("@stubs");

    if (stub === alrt.exist || stub === alrt.cree) {
      expect(stub).to.be.oneOf([alrt.exist, alrt.cree]);
    } else if (stub === alrt.erreur) {
      expect(stub).eq(alrt.erreur);
    }
  });

  it("S authentifier avec utilisateur cree", () => {
    const msg = cy.stub().as("msgs");
    cy.on("window:alert", msg);
    cy.intercept({
      method: "POST",
      url: "/login",
    }).as("inercepErreurAuhenif");

    cy.wait(1000);
    cy.get("#login2").click();
    cy.wait(1000);

    cy.login2(randomName, randomPwrd);

    cy.on("window:alert", (msg) => {
      const alrt = alrts[1];
      if (msg === alrt.veriflogin) {
        expect(msg).eq(alrt.veriflogin);
      } else if (msg === alrt.verifchamps) {
        expect(msg).eq(alrt.verifchamps);
      } else if (msg === alrt.verifpassword) {
        expect(msg).eq(alrt.verifpassword);
      }
    });

    cy.wait("@inercepErreurAuhenif").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      if (
        interception.response.body.errorMessage === "Wrong password." ||
        interception.response.body.errorMessage === "User does not exist."
      ) {
        cy.log(interception.response.body.errorMessage);
        cy.wrap(interception.response.body.errorMessage).as(
          "warpinterceperrorMsg"
        );
        const accesOK = "NOTOK";
        cy.wrap(accesOK).as("warpaccesOK");
      } else {
        const accesOK = "OK";
        cy.wrap(accesOK).as("warpaccesOK");
      }
    });
  });

  it("Saisir la commande", function () {
    if (this.warpaccesOK === "OK") {
      cy.get(".nav-link").should("include.text", randomName).and("be.visible");
      cy.get("#logout2").should("be.visible").and("include.text", "Log out");

      cy.get(".hrefch").contains("Samsung galaxy s6").click();
      cy.wait(1000);
      cy.url().should("contain", "/prod.html");
      cy.get("#tbodyid")
        .find(".price-container")
        .should("include.text", "$")
        .and("be.visible");
      cy.get("#imgp").each((image) => {
        expect(image).to.be.visible;
      });

      cy.get(".btn-success")
        .should("include.text", "Add to cart")
        .and("be.visible")
        .click();

      cy.on("window:alert", (mpADD) => {
        expect(mpADD).eq("Product added");
      });
    } else if (this.warpaccesOK === "NOTOK") {
      cy.log("Erreur d'acces", this.warpinterceperrorMsg);
    }
  });

  it("Valider la commande", function () {
    cy.intercept({
      method: "POST",
      url: "/deletecart",
    }).as("interceptiondeleted");

    if (this.warpaccesOK === "OK") {
      cy.get("#navbarExample").contains("Cart").click();
      cy.url().should("include", "cart.html");
      cy.contains("Samsung galaxy s6")

        .should("exist")
        .and("be.visible");

      cy.contains("Place Order").click();

      cy.get("#name").type(randomName);
      cy.get("#country").type(faker.address.country());
      cy.get("#city").type(faker.address.cityName());
      cy.get("#card").type(faker.finance.creditCardNumber("visa"));
      cy.get("#month").type(faker.date.month());
      cy.get("#year").type("2020");
      cy.get("#orderModal")
        .find(".btn-primary")
        .click()
        .then(() => {
          cy.on("window:alert", (msge) => {
            expect(msge).to.not.equal("Item deleted.");
          });

          cy.wait("@interceptiondeleted").then((interception) => {
            expect(interception.response.statusCode).eq(200);
            expect(interception.response.body).eq("Item deleted.");
          });
          cy.wait(2000);
          cy.contains("OK").click();
          // cy.visit("/index.html");
          cy.url().should("include", "index.html");
        });
    } else if (this.warpaccesOK === "NOTOK") {
      cy.log("Erreur d'acces", this.warpinterceperrorMsg);
    }
  });
});
