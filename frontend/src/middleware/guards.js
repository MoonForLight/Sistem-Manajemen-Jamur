// Route Guards untuk Role-Based Access
import { authService } from '../services/authService.js';

export const requireAuth = (to, from, next) => {
  if (authService.isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
};

export const requireRole = (requiredRole) => {
  return (to, from, next) => {
    const userRole = authService.getCurrentRole();

    if (!authService.isAuthenticated()) {
      next('/login');
    } else if (userRole !== requiredRole && requiredRole !== 'any') {
      next('/unauthorized');
    } else {
      next();
    }
  };
};

export const requireRoles = (allowedRoles) => {
  return (to, from, next) => {
    const userRole = authService.getCurrentRole();

    if (!authService.isAuthenticated()) {
      next('/login');
    } else if (!allowedRoles.includes(userRole)) {
      next('/unauthorized');
    } else {
      next();
    }
  };
};

export const requireGuest = (to, from, next) => {
  if (!authService.isAuthenticated()) {
    next();
  } else {
    next('/');
  }
};
