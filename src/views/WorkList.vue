<template>
  <div class="work-list">
    <div class="container">
      <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a class="breadcrumb-link-color" href="courses-teacher.html">Courses</a></li>
          <li class="breadcrumb-item active" aria-current="page">Computer Programming I</li>
        </ol>
      </nav>
    </div>

    <div class="container px-4">

      <h1>Computer Programming I works</h1>
      <br>
      <a class="btn btn-primary" href="new-work.html" role="button" style="font-family:Arial, FontAwesome">&#xF067; New Work</a>
      <a class="btn btn-primary" href="#" role="button" style="font-family:Arial, FontAwesome">&#xF0A1; New Announcement</a>
      <br>
      <br>

      <div class="row mb-3 border rounded-3">
        <div class="col-md-3 themed-grid-col">Exercise 1</div>
        <div class="col-md-6 themed-grid-col">
          <div class="progress">
            <div class="progress-bar bg-info" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-bar bg-success" role="progressbar" style="width: 40%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-bar bg-secondary" role="progressbar" style="width: 40%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        <div class="col-md-3 themed-grid-col text-end"><a class="btn btn-primary" href="exercise-1.html" role="button">View</a>
        </div>
      </div>

      <div class="row mb-3 border rounded-3">
        <div class="col-md-3 themed-grid-col">Exercise 2</div>
        <div class="col-md-6 themed-grid-col">
          <div class="progress">
            <div class="progress-bar bg-info" role="progressbar" style="width: 100%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-bar bg-success" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-bar bg-secondary" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        <div class="col-md-3 themed-grid-col text-end"><a class="btn btn-primary" href="exercise-1.html" role="button">View</a>
        </div>
      </div>

      <div class="row mb-3 border rounded-3">
        <div class="col-md-3 themed-grid-col">Exercise 3</div>
        <div class="col-md-6 themed-grid-col">
          <div class="progress">
            <div class="progress-bar bg-info" role="progressbar" style="width: 0%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-bar bg-success" role="progressbar" style="width: 50%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
            <div class="progress-bar bg-secondary" role="progressbar" style="width: 50%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        <div class="col-md-3 themed-grid-col text-end"><a class="btn btn-primary" href="exercise-1.html" role="button">View</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkList"
};
</script>

<style scoped>

</style>