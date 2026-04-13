// Route Guards untuk Role-Based Access
import { authService } from '../services/authService.js';

/**
 * Guard untuk check apakah user sudah login
 */
export const requireAuth = (to, from, next) => {
  if (authService.isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
};

/**
 * Guard untuk check role user
 * Contoh: beforeEnter: requireRole('admin')
 */
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

/**
 * Guard untuk check multiple roles
 * Contoh: beforeEnter: requireRoles(['admin', 'petugas'])
 */
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

/**
 * Guard public route (guest only)
 */
export const requireGuest = (to, from, next) => {
  if (!authService.isAuthenticated()) {
    next();
  } else {
    next('/');
  }
};
