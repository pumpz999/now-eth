describe('Web3 DApp Platform', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the dashboard', () => {
    cy.get('h4').contains('Dashboard').should('be.visible');
    cy.get('[data-testid="stats-grid"]').should('exist');
  });

  it('should navigate between pages', () => {
    cy.get('[data-testid="nav-templates"]').click();
    cy.url().should('include', '/templates');
    
    cy.get('[data-testid="nav-analytics"]').click();
    cy.url().should('include', '/analytics');
  });

  it('should handle wallet connection', () => {
    cy.get('[data-testid="connect-wallet"]').click();
    // Add assertions for wallet connection flow
  });

  it('should display error boundary on error', () => {
    cy.visit('/error-test');
    cy.get('[data-testid="error-boundary"]').should('be.visible');
    cy.get('button').contains('Try again').click();
  });
});
