# v1.0.4

* Bug fix: Add polyfill for Symbol. Fixes statex with react native in android.

# v1.0.3

* Bug fix: Fix error handling for Action. Now dispatch() rejects with error

# v1.0.2

* Bug fix: DataObserver.ngOnInit() was not being called if it was overridden by child class

# v1.0.1

* let `ActionObserver` now return `Observable<any>`, `Promise<any>` or the state itself as object
* update `statex` packages in examples to `^1.0.1`

# v1.0.0

* first version with finalized APIs compatible with Angular & React both with and without TypeScript and decorators.

# v0.0.2

* change API for React with E6 and decorators

# v0.0.1

* initial version - ported from [angular-reflux](https://github.com/rintoj/angular-reflux) & [react-reflux](https://github.com/rintoj/react-reflux)
* add react support `statex/react`
* add angular support `statex/angular`