import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot, UrlSegment, UrlSegmentGroup, UrlTree } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { TestBed, fakeAsync } from "@angular/core/testing";
import { Observable, of } from "rxjs";
import { featureFlagGuard } from "./auth-guard";
import { ɵWebAnimationsStyleNormalizer } from "@angular/animations/browser";
import { RouterTestingModule } from "@angular/router/testing";

describe('featureFlagGuard', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let notificationService: NotificationService;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        http = jasmine.createSpyObj('HttpClient', ['get']);
        notificationService = jasmine.createSpyObj('NotificationService', ['warnMessage']);
        router = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'parseUrl']);

        router.parseUrl.and.callFake((url: string) => {
            const urlTree = new UrlTree();
            const urlSegment = new UrlSegment(url, {});

            urlTree.root = new UrlSegmentGroup([urlSegment], {});

            return urlTree;
        });

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: HttpClient, useValue: http },
                { provide: Router, useValue: router },
                { provide: NotificationService, useValue: notificationService },
            ],
        });
    });

    it('should be created', () => {
        expect(featureFlagGuard).toBeTruthy();
    });

    it('admin should be able to access any routes', fakeAsync(async () => {
        http.get.and.returnValue(of({ identifier: 'admin', groups: [] }));

        const routes = [
            { url: 'test', featureFlag: 'PER1' },
            { url: 'test2', featureFlag: 'PER2' },
            { url: 'test3', featureFlag: '' },
        ];
        routes.forEach(async route => {
            const allowed = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(route.url, route.featureFlag));
            expect(allowed).toBeTruthy();
        });
    }));

    it('user should be able to access routes with matching feature flag', fakeAsync(async () => {
        http.get.and.returnValue(of({ identifier: 'user', groups: ['PER1'] }));

        const routes = [
            { url: 'test', featureFlag: 'PER1', allowed: true },
            { url: 'test2', featureFlag: 'PER2', allowed: false },
        ];
        routes.forEach(async (route) => {
            const allowed = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(route.url, route.featureFlag));
            if (route.allowed)
                expect(allowed).toBeTruthy();
            else
                expect(allowed).toBeFalsy();
        });
    }));

    function getAuthGuardWithDummyUrl(urlPath: string, featureFlag: string): () => any {
        const dummyRoute = new ActivatedRouteSnapshot()
        dummyRoute.data = { featureFlag };
        dummyRoute.url = [new UrlSegment(urlPath, {})];

        const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() } as RouterStateSnapshot;

        return () => featureFlagGuard(dummyRoute, dummyState);
    }

    async function runAuthGuardWithContext(authGuard: () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
        const result = TestBed.runInInjectionContext(authGuard)
        const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
        return authenticated
    }

    function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
        return new Promise<boolean | UrlTree>((resolve) => {
            result.subscribe((value) => {
                resolve(value);
            });
        });
    }
});