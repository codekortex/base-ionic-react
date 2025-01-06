import React, { useEffect } from 'react';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonModal,
    IonToast,
} from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { addUser, updateUser } from '../store/slices/userSlice';
import {
    selectUsersError,
    selectUsersLoading
} from '../store/selectors/userSelectors';
import { useForm, Controller } from 'react-hook-form';
import { User } from '../domain/entities/User';

interface UserFormProps {
    isOpen: boolean;
    user?: User | null;
    onDidDismiss: () => void;
}

interface FormData {
    name: string;
    email: string;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, user, onDidDismiss }) => {
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector(selectUsersError);
    const loading = useSelector(selectUsersLoading);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    useEffect(() => {
        reset({
            name: user?.name || '',
            email: user?.email || '',
        });
    }, [user, reset]);

    const onSubmit = (data: FormData) => {
        if (loading) return;

        if (user) {
            const updatedUser = {
                id: user.id,
                name: data.name,
                email: data.email,
            };
            dispatch(updateUser(updatedUser))
                .unwrap()
                .then(() => {
                    onDidDismiss();
                })
                .catch(() => { });

        } else {
            dispatch(addUser(data as User))
                .unwrap()
                .then(() => {
                    onDidDismiss();
                })
                .catch(() => { });
        }
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{user ? 'Edit User' : 'Add User'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onDidDismiss}>Cancel</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IonItem>
                        <IonLabel position="stacked">Name</IonLabel>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field: { onChange, value, onBlur } }) => (
                                <IonInput
                                    value={value}
                                    onIonInput={e => onChange(e.detail.value!)}
                                    onIonBlur={onBlur}
                                    placeholder="Enter name"
                                    className={errors.name ? 'ion-invalid' : ''}
                                />
                            )}
                        />
                        {errors.name && (
                            <div className="ion-padding-start ion-text-color-danger">
                                {errors.name.message}
                            </div>
                        )}
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Email</IonLabel>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            }}
                            render={({ field: { onChange, value, onBlur } }) => (
                                <IonInput
                                    type="email"
                                    value={value}
                                    onIonInput={e => onChange(e.detail.value!)}
                                    onIonBlur={onBlur}
                                    placeholder="Enter email"
                                    className={errors.email ? 'ion-invalid' : ''}
                                />
                            )}
                        />
                        {errors.email && (
                            <div className="ion-padding-start ion-text-color-danger">
                                {errors.email.message}
                            </div>
                        )}
                    </IonItem>

                    <div className="ion-padding">
                        <IonButton
                            expand="block"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : user ? 'Update' : 'Add'} User
                        </IonButton>
                    </div>
                </form>

                <IonToast
                    isOpen={!!error}
                    message={error || ''}
                    duration={3000}
                    color="danger"
                />
            </IonContent>
        </IonModal>
    );
};

export default UserForm;