import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signIn",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/course",
    name: "course",
    component: () =>
      import(/* webpackChunkName: "course" */ "@/views/course.vue"),
  },
  {
    path: "/course/:courseId",
    name: "course_detail",
    component: () =>
      import(/* webpackChunkName: "course" */ "@/views/course/detail.vue"),
  },
  {
    path: "/course/:courseId/work/:workId",
    name: "WorkSubmission",
    component: () =>
      import(/* webpackChunkName: "work" */ "@/views/course/submission.vue"),
  },
  {
    path: "/course/:courseId/work/:workId/submission/:submissionId",
    name: "exercise",
    component: () =>
      import(/* webpackChunkName: "work" */ "@/views/course/work.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
