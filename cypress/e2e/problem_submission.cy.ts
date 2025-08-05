describe("LeetLog Problem Submission", () => {
  it("should log in and allow a user to submit a new problem and see it listed", () => {
    // Visit the sign-in page
    cy.visit("/sign-in");

    // Fill in Clerk login form (update selectors as needed)
    cy.get('input[type="email"]').type(Cypress.env("TEST_EMAIL"));
    cy.get('input[type="password"]').type(Cypress.env("TEST_PASSWORD"));
    cy.get('button[type="submit"]').click();

    // Wait for redirect to problems page (adjust as needed)
    cy.url().should("include", "/problems");

    // Now continue with your test as before
    cy.contains("Add New Problem").click();
    cy.get('input[name="title"]').type("Cypress Test Problem");
    cy.get('input[name="url"]').type(
      "https://leetcode.com/problems/cypress-test/"
    );
    cy.get('select[name="difficulty"]').select("EASY");
    cy.get('input[name="languageUsed"]').type("JavaScript");
    cy.get('input[name="timeComplexity"]').type("O(1)");
    cy.get('input[name="spaceComplexity"]').type("O(1)");
    cy.get('input[name="categories"]').type("Array");
    cy.get('input[name="triggerKeywords"]').type("test");
    cy.get('textarea[name="solutionNotes"]').type("Test solution");
    cy.get('textarea[name="whatWentWrong"]').type("None");
    cy.get('input[name="wasHard"]').check(); // if checkbox, adjust as needed
    cy.contains("Submit").click();
    cy.contains("Cypress Test Problem").should("exist");
  });
});
