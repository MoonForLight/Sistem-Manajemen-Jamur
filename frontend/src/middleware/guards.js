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
      localStorage.setItem('redirectAfterLogin', to.fullPath);
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
      localStorage.setItem('redirectAfterLogin', to.fullPath);
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
    const user = authService.getCurrentUser();
    const lastRoute = localStorage.getItem('lastAuthRoute');
    if (user?.role === 'petugas' && lastRoute?.includes('/petugas')) {
      next(lastRoute);
    } else if (user?.role === 'admin' && lastRoute?.includes('/admin')) {
      next(lastRoute);
    } else if (user?.role === 'petugas') {
      next('/petugas/jamur');
    } else if (user?.role === 'admin') {
      next('/admin/dashboard');
    } else {
      next('/');
    }
  }
};
