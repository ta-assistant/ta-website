import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    meta: {
      breadcumb: "Home"
    },
    component: Home,
  },
  {
    path: "/signIn",
    name: "SignIn",
    meta: {
      breadcumb: "Sign In"
    }
    component: SignIn,
  },
  {
    path: "/course",
    name: "course",
    meta: {
      breadcumb: "Course",
    },
    component: () =>
      import(/* webpackChunkName: "course" */ "@/views/course.vue"),
  },
  {
    path: "/course/:courseId",
    name: "course_detail",
    meta: {
      breadcumb: "Course Detail"
    },
    component: () =>
      import(/* webpackChunkName: "course" */ "@/views/course/detail.vue"),
  },
  {
    path: "/course/:courseId/work/:workId",
    name: "WorkSubmission",
    meta: {
      breadcumb: "Work Submission"
    },
    component: () =>
      import(/* webpackChunkName: "work" */ "@/views/course/submission.vue"),
  },
  {
    path: "/course/:courseId/work/:workId/submission/:submissionId",
    name: "exercise",
    meta: {
      breadcumb: "Submission Detail"
    },
    component: () =>
      import(/* webpackChunkName: "work" */ "@/views/course/work.vue"),
  },
  {
    path: "/about",
    name: "About",
    meta: {
      breadcumb: "About"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    meta: {
      breadcumb: "Settings"
    },
    component: () =>
      import(/* webpackChunkName: "setting" */ "../views/settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
