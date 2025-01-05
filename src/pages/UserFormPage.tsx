import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonAlert } from '@ionic/react';
import { RootState, AppDispatch } from '../store';
import { useHistory, useParams } from 'react-router-dom';
import { addUser, fetchUsers, updateUser } from '../store/slices/userSlice';
import { UserModelView } from '../components/models/UserModelView';
import { FormInput } from './models/FormInput';

const UserFormPage: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInput>();
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const users = useSelector((state: RootState) => state.users.users);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const userId = parseInt(id, 10);
            const user = users.find(u => u.id === userId);
            if (user) {
                setValue('name', user.name);
                setValue('email', user.email);
            } else {
                dispatch(fetchUsers());
            }
        }
    }, [id, users, setValue, dispatch]);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        setLoading(true);
        setError(null);
        try {
            if (id) {
                const updatedUser: UserModelView = {
                    id: parseInt(id, 10),
                    name: data.name,
                    email: data.email,
                };
                await dispatch(updateUser(updatedUser)).unwrap();
            } else {
                const newUser: UserModelView = {
                    id: Date.now(),
                    name: data.name,
                    email: data.email,
                };
                await dispatch(addUser(newUser)).unwrap();
            }
            history.push('/user-list');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{id ? 'Editar Usuario' : 'Agregar Usuario'}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IonItem>
                        <IonLabel position="stacked">Nombre</IonLabel>
                        <IonInput
                            {...register('name', { required: 'El nombre es obligatorio' })}
                        />
                    </IonItem>
                    {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

                    <IonItem>
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput
                            type="email"
                            {...register('email', {
                                required: 'El email es obligatorio',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Formato de email inválido',
                                },
                            })}
                        />
                    </IonItem>
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

                    <IonButton expand="full" type="submit" disabled={loading}>
                        {loading ? <IonSpinner name="crescent" /> : id ? 'Actualizar' : 'Agregar'}
                    </IonButton>
                </form>

                {error && <IonAlert isOpen={!!error} onDidDismiss={() => setError(null)} header="Error" message={error} buttons={['OK']} />}
            </IonContent>
        </IonPage>
    );
};

export default UserFormPage;
